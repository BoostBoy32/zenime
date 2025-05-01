import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const VerificationPopup = () => {
  const popupContainerRef = useRef(null);
  const location = useLocation();
  
  // Constants matching the requirements
  const FIRST_DELAY_MS = 120 * 1000;              // 2 minutes
  const SHOW_TIME_MS = 6 * 60 * 1000;           // 6 minutes
  const WEEKLY_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  const LOCAL_STORAGE_KEY = "zenime_last_popup_time";

  useEffect(() => {
    // Only run on watch pages
    if (!location.pathname.startsWith('/watch/')) {
      console.log('VerificationPopup: Not on a watch page, skipping popup');
      return;
    }

    console.log('VerificationPopup: On watch page, checking last shown time');
    
    // Check if popup should be shown (based on weekly interval)
    const lastShownTime = localStorage.getItem(LOCAL_STORAGE_KEY);
    const now = Date.now();
    
    if (lastShownTime && (now - parseInt(lastShownTime, 10)) < WEEKLY_INTERVAL_MS) {
      // Don't show the popup if it was shown less than 7 days ago
      console.log('VerificationPopup: Popup was shown recently, skipping');
      return;
    }

    console.log(`VerificationPopup: Will show popup after ${FIRST_DELAY_MS/1000} seconds`);

    // Step 1: Inject CSS link in the document head
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = '/popup/popstyle.css';
    document.head.appendChild(linkElement);

    // Step 2: Wait for FIRST_DELAY_MS before fetching popup HTML
    const popupTimer = setTimeout(async () => {
      try {
        console.log('VerificationPopup: Delay elapsed, showing popup');
        
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
          console.log(`VerificationPopup: Popup is visible, will hide after ${SHOW_TIME_MS/1000} seconds`);
          
          // Step 4: Auto-hide the overlay after SHOW_TIME_MS
          setTimeout(() => {
            if (popupContainerRef.current) {
              popupContainerRef.current.style.display = 'none';
              // Set last shown timestamp
              localStorage.setItem(LOCAL_STORAGE_KEY, now.toString());
              console.log('VerificationPopup: Popup hidden and last shown time saved');
            }
            // Optional: remove the script when done
            scriptElement.remove();
          }, SHOW_TIME_MS);
        }
      } catch (error) {
        console.error('Error displaying verification popup:', error);
      }
    }, FIRST_DELAY_MS);

    // Cleanup function
    return () => {
      clearTimeout(popupTimer);
      console.log('VerificationPopup: Component unmounted, cleanup performed');
      // Remove the link element when component unmounts
      if (document.head.contains(linkElement)) {
        document.head.removeChild(linkElement);
      }
    };
  }, [location.pathname]); // Re-run if the pathname changes

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