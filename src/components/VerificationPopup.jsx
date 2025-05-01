import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const VerificationPopup = () => {
  console.log("[VerificationPopup] mounting…", Date.now());
  
  const popupContainerRef = useRef(null);
  const location = useLocation();
  
  // Test values for debugging (leave uncommented for testing)
  const FIRST_DELAY_MS = 5_000;    // 5s for testing
  const SHOW_TIME_MS = 10_000;   // 10s for testing
  const WEEKLY_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  // Production values (comment out during testing)
  // const FIRST_DELAY_MS = 120 * 1000;             // 2 minutes
  // const SHOW_TIME_MS = 6 * 60 * 1000;           // 6 minutes
  // const WEEKLY_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  const LOCAL_STORAGE_KEY = "zenime_last_popup_time";

  useEffect(() => {
    // Debug pathname check
    console.log("[VerificationPopup] pathname:", location.pathname);
    
    // Check localStorage state
    const lastShown = Number(localStorage.getItem(LOCAL_STORAGE_KEY)) || 0;
    console.log("[VerificationPopup] lastShown:", lastShown, lastShown ? new Date(lastShown).toISOString() : 'never', "now:", Date.now());
    
    // Force reset for testing - uncomment to always show popup
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    console.log("[VerificationPopup] localStorage cleared for testing");
    
    // Only run on watch pages - fix any path pattern issues
    if (!location.pathname.includes('/watch/')) {
      console.log('[VerificationPopup] Not on a watch page, skipping popup');
      return;
    }

    console.log('[VerificationPopup] On watch page, checking last shown time');
    
    // Check if popup should be shown (based on weekly interval)
    const now = Date.now();
    
    if (lastShown && (now - lastShown) < WEEKLY_INTERVAL_MS) {
      // Don't show the popup if it was shown less than interval ago
      console.log(`[VerificationPopup] Popup was shown recently (${Math.floor((now - lastShown) / 1000 / 60)} mins ago), skipping`);
      return;
    }

    console.log(`[VerificationPopup] scheduling popup to show after ${FIRST_DELAY_MS}ms`);

    // Step 1: Inject CSS link in the document head
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = '/popup/popstyle.css';
    document.head.appendChild(linkElement);

    // Step 2: Wait for FIRST_DELAY_MS before fetching popup HTML
    const popupTimer = setTimeout(async () => {
      try {
        console.log('[VerificationPopup] Delay elapsed, showPopup firing NOW');
        
        // Fetch the popup HTML content
        const response = await fetch('/popup/popup.html');
        if (!response.ok) throw new Error('Failed to fetch popup HTML');
        const htmlContent = await response.text();
        
        // Set the HTML content to the container ref
        if (popupContainerRef.current) {
          popupContainerRef.current.innerHTML = htmlContent;
          
          // Make the popup visible BEFORE adding script
          popupContainerRef.current.style.display = 'block';
          
          // Step 3: Append script to run the original popup rules
          const scriptElement = document.createElement('script');
          scriptElement.src = '/popup/popscript.js';
          document.body.appendChild(scriptElement);
          
          // Check if popup is actually visible in DOM
          const popup = document.getElementById("human-verification-popup");
          if (popup) {
            popup.style.display = 'block'; // Explicitly set display to block
            const computedStyle = window.getComputedStyle(popup);
            console.log('[VerificationPopup] Popup element found, display:', computedStyle.display, 'z-index:', computedStyle.zIndex);
          } else {
            console.error('[VerificationPopup] Popup element not found in DOM!');
          }
          
          console.log(`[VerificationPopup] Popup should be visible, will hide after ${SHOW_TIME_MS/1000} seconds`);
          
          // Step 4: Auto-hide the overlay after SHOW_TIME_MS
          const hideTimer = setTimeout(() => {
            if (popupContainerRef.current) {
              popupContainerRef.current.style.display = 'none';
              // Set last shown timestamp
              localStorage.setItem(LOCAL_STORAGE_KEY, now.toString());
              console.log('[VerificationPopup] Popup hidden and last shown time saved');
            }
            // Optional: remove the script when done
            if (document.body.contains(scriptElement)) {
              scriptElement.remove();
            }
          }, SHOW_TIME_MS);
          
          // Store reference to the hide timer for cleanup
          popupContainerRef.current.hideTimerRef = hideTimer;
        }
      } catch (error) {
        console.error('Error displaying verification popup:', error);
      }
    }, FIRST_DELAY_MS);

    // Store reference to the show timer
    if (popupContainerRef.current) {
      popupContainerRef.current.showTimerRef = popupTimer;
    }

    // Cleanup function
    return () => {
      // Clean up both timers
      if (popupContainerRef.current) {
        if (popupContainerRef.current.showTimerRef) {
          console.log('[VerificationPopup] Cleaning up show timer');
          clearTimeout(popupContainerRef.current.showTimerRef);
        }
        if (popupContainerRef.current.hideTimerRef) {
          console.log('[VerificationPopup] Cleaning up hide timer');
          clearTimeout(popupContainerRef.current.hideTimerRef);
        }
      } else {
        console.log('[VerificationPopup] Cleaning up show timer (no ref)');
        clearTimeout(popupTimer);
      }
      
      console.log('[VerificationPopup] Component unmounted, cleanup performed');
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