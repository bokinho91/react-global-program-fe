// components/Portal.jsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [container] = useState(() => document.createElement('div')); // Create div once
  const portalRoot = document.getElementById('portal-root'); // Get the predefined root

  useEffect(() => {
    if (portalRoot) {
      portalRoot.appendChild(container);
    }

    // Cleanup function to remove the element when the component unmounts
    return () => {
      if (portalRoot) {
        portalRoot.removeChild(container);
      }
    };
  }, [container, portalRoot]); // Dependencies ensure logic runs correctly

  if (!portalRoot) {
    return null; // Or handle error
  }

  return createPortal(children, container);
};

export default Portal;
