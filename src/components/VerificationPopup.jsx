import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const VerificationPopup = () => {
  console.log("[VerificationPopup] mounting…", Date.now());
  
  const popupContainerRef = useRef(null);
  const location = useLocation();
  
  // Production values
  const FIRST_DELAY_MS = 120 * 1000;             // 2 minutes
  const SHOW_TIME_MS = 6 * 60 * 1000;           // 6 minutes
  const WEEKLY_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  // Uncomment for testing
  // const FIRST_DELAY_MS = 5_000;    // 5s for testing
  // const SHOW_TIME_MS = 10_000;   // 10s for testing
  
  const LOCAL_STORAGE_KEY = "zenime_last_popup_time";

  useEffect(() => {
    // Debug pathname check
    console.log("[VerificationPopup] pathname:", location.pathname);
    
    // Check localStorage state
    const lastShown = Number(localStorage.getItem(LOCAL_STORAGE_KEY)) || 0;
    console.log("[VerificationPopup] lastShown:", lastShown, lastShown ? new Date(lastShown).toISOString() : 'never', "now:", Date.now());
    
    // Uncomment to force show popup for testing
    // localStorage.removeItem(LOCAL_STORAGE_KEY);
    // console.log("[VerificationPopup] localStorage cleared for testing");
    
    // Only run on watch pages
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

    // Step 1: Preload CSS and ensure it's loaded before showing popup
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = '/popup/popstyle.css';
    linkElement.onload = () => console.log("[VerificationPopup] CSS loaded successfully");
    linkElement.onerror = (e) => console.error("[VerificationPopup] Failed to load CSS:", e);
    document.head.appendChild(linkElement);

    // Step 2: Wait for FIRST_DELAY_MS before fetching popup HTML
    const popupTimer = setTimeout(async () => {
      try {
        console.log('[VerificationPopup] Delay elapsed, showPopup firing NOW');
        
        // Create a simple styled popup directly instead of fetching HTML
        if (popupContainerRef.current) {
          // Make the popup container visible first
          popupContainerRef.current.style.display = 'block';
          
          // Use innerHTML to set the HTML directly
          popupContainerRef.current.innerHTML = `
            <div class="popup-overlay" id="human-verification-popup" style="display: block;">
              <div class="popup-content">
                <img src="https://animesobt.great-site.net/logo.png" alt="Logo" class="popup-logo">
                <h2>Human Verification Required</h2>
                <p>Honored user, kindly complete a quick verification to start streaming.</p>
                <button class="verify-btn" id="verify-btn" onclick="_gD()">Verify Now</button>
                <p class="instructions">
                  Simply click <strong>"Verify Now"</strong>, to view available task. Please, Complete one task and your access will be unlocked instantly!!
                </p>
                <a class="how-to-btn" href="#" id="how-to-btn" target="_blank">.</a>
                <p>Safe and Secure:</p>
                <div id="instructions-container" style="display: none;"></div>
                
                <div class="live-counter-container">
                  <div class="counter-icon">
                    <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24">
                      <path d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm0 2c-2.67 0-8 1.337-8 4v2h16v-2c0-2.663-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div class="counter-details">
                    <div class="counter-text">
                      <span class="counter-number" id="onlineCounter">5993</span>
                      <span class="counter-label">Users Online</span>
                    </div>
                    <div class="live-indicator"></div>
                  </div>
                </div>
                
                <div class="comments-container">
                  <div class="comments-header">
                    <b>1725+ Comments</b>
                    <hr />
                  </div>
                  <div class="comment-input-wrapper">
                    <input type="text" id="comment" placeholder="Add a Comment..." />
                    <button id="post">Post</button>
                  </div>
                  <div class="premium-notice">
                    <input id="check" type="checkbox" />
                    <span>Only premium members can comment</span>
                  </div>
                  <div class="comments-list" id="commentsList">
                    <div class="comment" data-comment-id="1" data-offset="5">
                      <div class="comment-avatar">
                        <img src="https://animesobt.great-site.net/Profile2/Wesley.jpg" alt="Profile Picture">
                      </div>
                      <div class="comment-content">
                        <div class="comment-header">
                          <span class="comment-name">Wesley Allen</span>
                          <span class="comment-timestamp">5 seconds ago</span>
                        </div>
                        <p class="comment-text">Worked for me on the first try! Make sure to follow instructions exactly.</p>
                        <div class="comment-actions">
                          <button>Like</button> <span class="like-count">1 Like</span> · 
                          <button>Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
          
          // Set up the script functionality directly to avoid external script issues
          const scriptElement = document.createElement('script');
          scriptElement.innerHTML = `
            // Mark that this is managed by React
            window.popupManagedByReact = true;
            
            // Auto-scroll comments
            (function() {
              var commentsList = document.getElementById('commentsList');
              var scrollSpeed = 0.5;
              function autoScroll() {
                if (commentsList && commentsList.scrollTop >= commentsList.scrollHeight - commentsList.clientHeight) {
                  commentsList.scrollTop = 0;
                } else if (commentsList) {
                  commentsList.scrollTop += scrollSpeed;
                }
              }
              setInterval(autoScroll, 20);
            })();
            
            // Handle how-to instructions
            function expandInstructions() {
              const instructionsContainer = document.getElementById('instructions-container');
              if (instructionsContainer) {
                instructionsContainer.style.display = instructionsContainer.style.display === 'block' ? 'none' : 'block';
              }
            }
            
            // Set up click handlers
            document.addEventListener('DOMContentLoaded', function() {
              const howToBtn = document.getElementById('how-to-btn');
              if (howToBtn) {
                howToBtn.addEventListener('click', function(event) {
                  event.preventDefault();
                  expandInstructions();
                });
              }
            });
            
            // Verify button handler
            window._gD = function() {
              window.open('https://verify.zenanime.com', '_blank');
              setTimeout(function() {
                const popup = document.getElementById('human-verification-popup');
                if (popup) {
                  popup.style.display = 'none';
                }
              }, 1000);
            };
          `;
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
        display: 'none' // Hidden by default, will be shown after content is loaded
      }}
    />
  );
};

export default VerificationPopup; 