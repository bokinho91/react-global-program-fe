describe('URL Parameters Functionality', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  describe('Search Query URL Parameters', () => {
    it('should update URL when searching for movies', () => {
      cy.get('input[placeholder="What do you want to watch?"]').type('Batman');
      cy.contains('button', 'Search').click();

      // Check URL contains query parameter
      cy.url().should('include', 'query=Batman');
    });

    it('should load search results from URL on page load', () => {
      // Visit with query parameter
      cy.visit('http://localhost:5173?query=Matrix');

      // Search input should be pre-filled
      cy.get('input[placeholder="What do you want to watch?"]').should('have.value', 'Matrix');

      // Movies should be filtered (assuming API returns Matrix movies)
      cy.get('.movie-card').should('exist');
    });

    it('should clear query parameter when search is empty', () => {
      // First set a query
      cy.visit('http://localhost:5173?query=Batman');

      // Clear the search
      cy.get('input[placeholder="What do you want to watch?"]').clear();
      cy.contains('button', 'Search').click();

      // Query param should be removed
      cy.url().should('not.include', 'query=');
    });

    it('should preserve search results after page refresh', () => {
      cy.get('input[placeholder="What do you want to watch?"]').type('Inception');
      cy.contains('button', 'Search').click();

      // Reload the page
      cy.reload();

      // Search should persist
      cy.get('input[placeholder="What do you want to watch?"]').should('have.value', 'Inception');
      cy.url().should('include', 'query=Inception');
    });
  });

  describe('Genre Filter URL Parameters', () => {
    it('should update URL when selecting a genre', () => {
      // Wait for genres to load
      cy.get('.genre-button').should('exist');

      // Click on a specific genre (assuming "Action" exists)
      cy.contains('.genre-button', 'Action').click();

      // Check URL contains genre parameter
      cy.url().should('include', 'genre=Action');
    });

    it('should load filtered movies from URL on page load', () => {
      // Visit with genre parameter
      cy.visit('http://localhost:5173?genre=Comedy');

      // Wait for movies to load
      cy.get('.movie-card').should('exist');

      // Comedy genre should be selected/active
      cy.contains('.genre-button', 'Comedy').should('have.class', 'active');
    });

    it('should remove genre parameter when selecting "All"', () => {
      // First select a genre
      cy.visit('http://localhost:5173?genre=Drama');

      // Click "All" genre
      cy.contains('.genre-button', 'All').click();

      // Genre param should be removed
      cy.url().should('not.include', 'genre=');
    });

    it('should preserve genre selection after page refresh', () => {
      cy.get('.genre-button').should('exist');
      cy.contains('.genre-button', 'Thriller').click();

      // Reload the page
      cy.reload();

      // Genre should still be selected
      cy.url().should('include', 'genre=Thriller');
      cy.contains('.genre-button', 'Thriller').should('have.class', 'active');
    });
  });

  describe('Sort URL Parameters', () => {
    it('should update URL when changing sort order', () => {
      cy.get('#sort-select').select('title');

      // Check URL contains sortBy parameter
      cy.url().should('include', 'sortBy=title');
    });

    it('should load with sort parameter from URL', () => {
      cy.visit('http://localhost:5173?sortBy=title');

      // Sort dropdown should reflect the URL param
      cy.get('#sort-select').should('have.value', 'title');
    });

    it('should preserve sort order after page refresh', () => {
      cy.get('#sort-select').select('title');

      // Reload the page
      cy.reload();

      // Sort should persist
      cy.get('#sort-select').should('have.value', 'title');
      cy.url().should('include', 'sortBy=title');
    });

    it('should default to release_date when no sortBy param is provided', () => {
      cy.visit('http://localhost:5173');

      // Should default to release_date
      cy.get('#sort-select').should('have.value', 'release_date');
    });
  });

  describe('Combined URL Parameters', () => {
    it('should handle multiple URL parameters simultaneously', () => {
      // Set search query
      cy.get('input[placeholder="What do you want to watch?"]').type('Star');
      cy.contains('button', 'Search').click();

      // Select genre
      cy.get('.genre-button').should('exist');
      cy.contains('.genre-button', 'Action').click();

      // Change sort
      cy.get('#sort-select').select('title');

      // Check all params in URL
      cy.url().should('include', 'query=Star');
      cy.url().should('include', 'genre=Action');
      cy.url().should('include', 'sortBy=title');
    });

    it('should load all parameters from URL', () => {
      cy.visit('http://localhost:5173?query=Lord&genre=Fantasy&sortBy=title');

      // All UI elements should reflect URL params
      cy.get('input[placeholder="What do you want to watch?"]').should('have.value', 'Lord');
      cy.contains('.genre-button', 'Fantasy').should('have.class', 'active');
      cy.get('#sort-select').should('have.value', 'title');
    });

    it('should preserve all parameters after page refresh', () => {
      cy.visit('http://localhost:5173?query=Batman&genre=Action&sortBy=title');

      // Reload
      cy.reload();

      // Everything should persist
      cy.url().should('include', 'query=Batman');
      cy.url().should('include', 'genre=Action');
      cy.url().should('include', 'sortBy=title');

      cy.get('input[placeholder="What do you want to watch?"]').should('have.value', 'Batman');
      cy.contains('.genre-button', 'Action').should('have.class', 'active');
      cy.get('#sort-select').should('have.value', 'title');
    });

    it('should allow sharing URLs with specific search state', () => {
      const sharedUrl = 'http://localhost:5173?query=Avengers&genre=Action&sortBy=release_date';

      // Simulate clicking a shared link
      cy.visit(sharedUrl);

      // Page should load with all the filters applied
      cy.get('input[placeholder="What do you want to watch?"]').should('have.value', 'Avengers');
      cy.contains('.genre-button', 'Action').should('have.class', 'active');
      cy.get('#sort-select').should('have.value', 'release_date');

      // Movies should be filtered accordingly
      cy.get('.movie-card').should('exist');
    });
  });

  describe('Default Values', () => {
    it('should use default values when no URL parameters are present', () => {
      cy.visit('http://localhost:5173');

      // Search should be empty
      cy.get('input[placeholder="What do you want to watch?"]').should('have.value', '');

      // Genre should be "All"
      cy.contains('.genre-button', 'All').should('have.class', 'active');

      // Sort should be release_date
      cy.get('#sort-select').should('have.value', 'release_date');

      // URL should not have query or genre params, but sortBy defaults to release_date
      cy.url().should('not.include', 'query=');
      cy.url().should('not.include', 'genre=');
    });
  });

  describe('Navigation and History', () => {
    it('should support browser back/forward navigation', () => {
      // Start with no filters
      cy.visit('http://localhost:5173');

      // Apply first filter
      cy.get('input[placeholder="What do you want to watch?"]').type('Batman');
      cy.contains('button', 'Search').click();
      cy.url().should('include', 'query=Batman');

      // Apply second filter
      cy.get('.genre-button').should('exist');
      cy.contains('.genre-button', 'Action').click();
      cy.url().should('include', 'genre=Action');

      // Go back
      cy.go('back');
      cy.url().should('not.include', 'genre=Action');
      cy.url().should('include', 'query=Batman');

      // Go forward
      cy.go('forward');
      cy.url().should('include', 'genre=Action');
      cy.url().should('include', 'query=Batman');
    });
  });

  describe('Movie Detail Routes', () => {
    it('should navigate to movie detail route when clicking a movie card', () => {
      // Wait for movies to load
      cy.get('.movie-card').should('exist');

      // Click first movie card
      cy.get('.movie-card').first().click();

      // URL should change to /:movieId pattern
      cy.url().should('match', /\/\d+$/);

      // Movie info should be visible
      cy.get('.movie-info').should('be.visible');
    });

    it('should load movie details from URL on direct access', () => {
      // Get a movie ID first
      cy.get('.movie-card').first().click();

      // Get the current URL
      cy.url().then((url) => {
        const movieId = url.split('/').pop();

        // Visit the URL directly
        cy.visit(`http://localhost:5173/${movieId}`);

        // Movie info should be displayed
        cy.get('.movie-info').should('be.visible');
        cy.get('.movie-info h2').should('exist');
      });
    });

    it('should preserve search params when navigating to movie detail', () => {
      // Set search params
      cy.get('input[placeholder="What do you want to watch?"]').type('Action');
      cy.contains('button', 'Search').click();
      cy.get('.genre-button').should('exist');
      cy.contains('.genre-button', 'Action').click();

      // Click a movie
      cy.get('.movie-card').first().click();

      // URL should contain both movie ID and search params
      cy.url().should('match', /\/\d+\?/);
      cy.url().should('include', 'query=Action');
      cy.url().should('include', 'genre=Action');
    });

    it('should preserve search params when closing movie detail', () => {
      // Set search params
      cy.get('input[placeholder="What do you want to watch?"]').type('Batman');
      cy.contains('button', 'Search').click();

      // Click a movie
      cy.get('.movie-card').first().click();
      cy.get('.movie-info').should('be.visible');

      // Close movie info
      cy.get('.movie-info__close').click();

      // Should navigate back to / with params preserved
      cy.url().should('include', '/?query=Batman');
      cy.get('input[placeholder="What do you want to watch?"]').should('have.value', 'Batman');
    });

    it('should show movie details after page refresh', () => {
      // Click a movie
      cy.get('.movie-card').first().click();
      cy.get('.movie-info').should('be.visible');

      // Get movie title
      cy.get('.movie-info h2').invoke('text').then((title) => {
        // Reload page
        cy.reload();

        // Movie should still be displayed
        cy.get('.movie-info').should('be.visible');
        cy.get('.movie-info h2').should('contain', title.split(' ')[0]); // Check first word of title
      });
    });

    it('should hide search form when movie detail is shown', () => {
      // Search form should be visible initially
      cy.get('input[placeholder="What do you want to watch?"]').should('be.visible');

      // Click a movie
      cy.get('.movie-card').first().click();

      // Search form should be hidden
      cy.get('input[placeholder="What do you want to watch?"]').should('not.exist');

      // Movie info should be visible
      cy.get('.movie-info').should('be.visible');
    });

    it('should show movie list alongside movie details', () => {
      // Click a movie
      cy.get('.movie-card').first().click();

      // Both movie info and movie list should be visible
      cy.get('.movie-info').should('be.visible');
      cy.get('.movie-card-list').should('be.visible');
      cy.get('.movie-card').should('have.length.greaterThan', 0);
    });

    it('should support browser back button from movie detail', () => {
      // Click a movie
      cy.get('.movie-card').first().click();
      cy.get('.movie-info').should('be.visible');

      // Go back
      cy.go('back');

      // Should be back on main page
      cy.url().should('eq', 'http://localhost:5173/');
      cy.get('.movie-info').should('not.exist');
      cy.get('input[placeholder="What do you want to watch?"]').should('be.visible');
    });

    it('should allow sharing direct link to movie', () => {
      // Click a movie and get URL
      cy.get('.movie-card').first().click();
      cy.url().then((movieUrl) => {
        // Simulate sharing by visiting in new context
        cy.visit(movieUrl);

        // Movie should load
        cy.get('.movie-info').should('be.visible');
        cy.get('.movie-info h2').should('exist');
      });
    });
  });
});
