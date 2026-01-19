describe('Movie App E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the app and display all components', () => {
    // Verify Counter component is present
    cy.contains('COUNTER').should('be.visible');
    cy.contains('button', 'Increment').should('be.visible');
    cy.contains('button', 'Decrement').should('be.visible');

    // Verify Search component is present
    cy.contains('SEARCH').should('be.visible');
    cy.get('input[placeholder="What do you want to watch?"]').should('be.visible');

    // Verify Genres component is present
    cy.contains('GENRES').should('be.visible');
    cy.contains('button', 'All').should('be.visible');

    // Verify movies are loaded
    cy.contains('movies found').should('be.visible');
  });

  it('should increment and decrement counter', () => {
    // Check initial value is 0
    cy.contains('COUNTER').parent().within(() => {
      cy.contains('0').should('be.visible');

      // Click increment
      cy.contains('button', 'Increment').click();
      cy.contains('1').should('be.visible');

      // Click increment again
      cy.contains('button', 'Increment').click();
      cy.contains('2').should('be.visible');

      // Click decrement
      cy.contains('button', 'Decrement').click();
      cy.contains('1').should('be.visible');
    });
  });

  it('should filter movies by search query', () => {
    // Wait for movies to load
    cy.contains('movies found', { timeout: 10000 }).should('be.visible');


    // Wait for movies to load from API
    cy.intercept('GET', 'http://localhost:4000/movies*').as('getMovies');
    cy.wait('@getMovies');

    // Get initial movie count
    cy.get('[data-testid="movie-count"]').invoke('text').then((text) => {
      cy.log('Initial movies found text:', text);
      const initialCount = parseInt(text.match(/\d+/)?.[0] || '0');
      expect(initialCount).to.be.above(0);
    });

    // Type in search box
    cy.get('input[placeholder="What do you want to watch?"]').type('The');

    // Click search button
    cy.contains('button', 'Search').click();

    // Verify filtered results
    cy.contains('movies found').should('be.visible');
  });

  it('should filter movies by search query using Enter key', () => {
    // Wait for movies to load
    cy.contains('movies found', { timeout: 10000 }).should('be.visible');

    // Type in search box and press Enter
    cy.get('input[placeholder="What do you want to watch?"]')
      .type('Matrix{enter}');

    // Verify search was performed
    cy.contains('movies found').should('be.visible');
  });

  it('should filter movies by genre', () => {
    // Wait for genres and movies to load
    cy.contains('movies found', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'All').should('be.visible');
    cy.contains('button', "All").should('have.css', 'background-color', 'rgb(255, 0, 0)');

    // Get initial movie count
    cy.contains('movies found').invoke('text').then(() => {
      // Wait for a genre you know exists in your data
      cy.contains('button', 'Romance', { timeout: 10000 }).should('be.visible');

      cy.contains('button', 'Romance').click();

      cy.wait(1000); // Wait for API and render

      // Check that at least one movie card contains "Romance" in its genres
      cy.get('.movie-card').first().should('contain', 'Romance');
    });
  });

  it('should reset filter when clicking "All" genre', () => {
    // Wait for movies to load
    cy.contains('movies found', { timeout: 10000 }).should('be.visible');

    // Get initial count
    cy.contains('movies found').invoke('text').then((initialText) => {
      const initialCount = parseInt(initialText.match(/\d+/)?.[0] || '0');

      // Click on a specific genre (not All)
      cy.get('button').contains(/^(?!All$)/).first().click();
      cy.get('button').contains(/^(?!Drama$)/).first().click();

      // Wait for filter to apply
      cy.wait(500);

      // Click "All" to reset
      cy.contains('button', 'All').click();

      // Verify count is back to original
      cy.contains('movies found').invoke('text').then((resetText) => {
        const resetCount = parseInt(resetText.match(/\d+/)?.[0] || '0');
        expect(resetCount).to.equal(initialCount);
      });
    });
  });

  it('should display movie cards with correct information', () => {
    // Wait for movies to load
    cy.contains('movies found', { timeout: 10000 }).should('be.visible');

    // Check that movie cards have required elements
    cy.get('.movie-card').first().within(() => {
      cy.get('img').should('be.visible');
      cy.get('h3').should('be.visible'); // Title
      cy.get('p').should('have.length.at.least', 1); // Overview and genres
    });
  });

  it('should combine search and genre filters', () => {
    // Wait for movies to load
    cy.contains('movies found', { timeout: 10000 }).should('be.visible');

    // First filter by genre
    cy.get('button').contains(/^(?!All$)/).first().click();
    cy.wait(500);

    // Then search
    cy.get('input[placeholder="What do you want to watch?"]')
      .type('a{enter}');

    // Verify results are still displayed
    cy.contains('movies found').should('be.visible');
  });
});
