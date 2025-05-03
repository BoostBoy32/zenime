/**
 * Popup Blocker - Removes verification popups from the page
 */

export const initializePopupBlocker = () => {
  // Function to remove popups immediately
  const removePopups = () => {
    // Target both human-verification-popup and simple-popup-overlay
    const popupSelectors = [
      '#human-verification-popup',
      '#simple-popup-overlay',
      'div[id="simple-popup-overlay"]',
      '.popup-overlay'
    ];

    popupSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.display = 'none';
        element.style.zIndex = '-9999';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        element.style.pointerEvents = 'none';
        
        // Try to remove if possible
        if (element.parentNode) {
          try {
            element.parentNode.removeChild(element);
          } catch (e) {
            console.log('Could not remove popup element, applying style overrides instead');
          }
        }
      });
    });
  };

  // MutationObserver to watch for dynamically added popups
  const setupMutationObserver = () => {
    const observer = new MutationObserver((mutations) => {
      let shouldRemove = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              if (
                node.id === 'human-verification-popup' || 
                node.id === 'simple-popup-overlay' ||
                node.classList.contains('popup-overlay')
              ) {
                shouldRemove = true;
              } else if (node.querySelector) {
                const popups = node.querySelectorAll('#human-verification-popup, #simple-popup-overlay, .popup-overlay');
                if (popups.length > 0) {
                  shouldRemove = true;
                }
              }
            }
          });
        }
      });
      
      if (shouldRemove) {
        removePopups();
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return observer;
  };

  // Initial removal
  const removeInterval = setInterval(removePopups, 500);
  
  // Setup after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      removePopups();
      const observer = setupMutationObserver();
      
      // Clear interval after 10 seconds to avoid performance issues
      setTimeout(() => {
        clearInterval(removeInterval);
      }, 10000);
    });
  } else {
    removePopups();
    const observer = setupMutationObserver();
    
    // Clear interval after 10 seconds to avoid performance issues
    setTimeout(() => {
      clearInterval(removeInterval);
    }, 10000);
  }
  
  // Also disable related localStorage items
  try {
    localStorage.removeItem('popupStartTime');
    localStorage.removeItem('lastPopupTime');
    localStorage.setItem('lastPopupTime', Date.now() + (365 * 24 * 60 * 60 * 1000).toString());
  } catch (e) {
    console.log('Could not modify localStorage items');
  }
};

export default initializePopupBlocker; 