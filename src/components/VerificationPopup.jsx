import { useEffect, useRef } from 'react';

const VerificationPopup = () => {
  const popupContainerRef = useRef(null);
  const FIRST_DELAY_MS = 2000; // Delay before showing popup
  const AUTO_HIDE_DELAY_MS = 10000; // Auto-hide after 10 seconds (adjust as needed)

  useEffect(() => {
    // Step 1: Inject CSS link in the document head
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = '/popup/popstyle.css';
    document.head.appendChild(linkElement);

    // Step 2: Wait for FIRST_DELAY_MS before fetching popup HTML
    const popupTimer = setTimeout(async () => {
      try {
        // Fetch the popup HTML content
        const response = await fetch('/popup/popup.html');
        if (!response.ok) throw new Error('Failed to fetch popup HTML');
        const htmlContent = await response.text();
        
        // Set the HTML content to the container ref
        if (popupContainerRef.current) {
          popupContainerRef.current.innerHTML = htmlContent;
          
          // Step 3: Append script to run the original popup rules
          const scriptElement = document.createElement('script');
          scriptElement.src = '/popup/popscript.js';
          document.body.appendChild(scriptElement);
          
          // Make the popup visible
          popupContainerRef.current.style.display = 'block';
          
          // Step 4: Auto-hide the overlay after timeout
          setTimeout(() => {
            if (popupContainerRef.current) {
              popupContainerRef.current.style.display = 'none';
            }
            // Optional: remove the script when done
            scriptElement.remove();
          }, AUTO_HIDE_DELAY_MS);
        }
      } catch (error) {
        console.error('Error displaying verification popup:', error);
      }
    }, FIRST_DELAY_MS);

    // Cleanup function
    return () => {
      clearTimeout(popupTimer);
      // Remove the link element when component unmounts
      document.head.removeChild(linkElement);
    };
  }, []); // Empty dependency array so this runs once on mount

  return (
    <div 
      ref={popupContainerRef} 
      className="verification-popup-container" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 9999, 
        display: 'none' // Hidden by default, will be shown after HTML is loaded
      }}
    />
  );
};

export default VerificationPopup; 