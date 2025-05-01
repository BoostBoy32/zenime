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
  
  // Test values - comment out in production
  // const FIRST_DELAY_MS = 5_000;    // 5s for testing
  // const SHOW_TIME_MS = 10_000;   // 10s for testing
  // const WEEKLY_INTERVAL_MS = 30_000; // 30 seconds for testing
  
  const LOCAL_STORAGE_KEY = "zenime_last_popup_time";

  // Inline CSS styles to avoid external dependencies
  const popupStyles = `
    .verification-popup-container * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    .popup-overlay {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 9999;
      overflow-y: auto;
    }
    
    .popup-logo {
      display: block;
      max-width: 120px;
      margin: 0 auto 15px;
      border-radius: 10px;
    }
    
    .popup-content {
      position: relative;
      max-width: 700px;
      width: 95%;
      margin: 80px auto;
      padding: 30px 20px;
      background: linear-gradient(145deg, #ffffff, #f3f3f3);
      border-radius: 16px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5);
      text-align: center;
      color: #333;
    }
    
    .popup-content h2 {
      font-size: 1.8rem;
      color: #007BFF;
      margin-bottom: 8px;
      font-weight: bold;
    }
    
    .popup-content p {
      font-size: 1rem;
      margin-top: 8px;
      line-height: 1.5;
      color: #555;
    }
    
    .popup-content .verify-btn {
      padding: 10px 25px;
      font-size: 1.1rem;
      background-color: #28a745;
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: background-color 0.3s ease, transform 0.2s ease;
      margin-top: 12px;
      margin-bottom: 12px;
    }
    
    .popup-content .verify-btn:hover {
      background-color: #218838;
      transform: scale(1.05);
    }
    
    .popup-content .instructions {
      font-size: 0.95rem;
      color: #000;
      margin-top: 10px;
      font-style: italic;
    }
    
    .popup-content .how-to-btn {
      position: absolute;
      right: 20px;
      bottom: 5px;
      font-size: 0.9rem;
      padding: 8px 15px;
      background-color: #007BFF;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-decoration: none;
    }
    
    .popup-content .how-to-btn:hover {
      background-color: #0056b3;
    }
    
    #instructions-container {
      margin-top: 15px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    
    .live-counter-container {
      background: #000;
      padding: 8px 12px;
      border-radius: 12px;
      width: 200px;
      margin: 20px auto;
      display: flex;
      align-items: center;
      font-family: 'Roboto', sans-serif;
      color: #fff;
      border: 1px solid #333;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.8);
    }
    
    .counter-icon {
      background: linear-gradient(45deg, #28a745, #7dd56f);
      padding: 6px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
    }
    
    .counter-details {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .counter-text {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }
    
    .counter-number {
      font-size: 1.4rem;
      font-weight: 700;
    }
    
    .counter-label {
      font-size: 0.8rem;
      color: #bbb;
    }
    
    .live-indicator {
      width: 10px;
      height: 10px;
      background-color: #ff4d4d;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(255, 77, 77, 0.7);
      animation: pulseModern 1.5s infinite;
    }
    
    @keyframes pulseModern {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .comments-container {
      background: #fff;
      padding: 20px;
      margin-top: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: left;
    }
    
    .comments-header {
      overflow: auto;
      padding-bottom: 5px;
    }
    
    .comments-header b {
      font-size: 1.2rem;
      color: #333;
    }
    
    .comments-container hr {
      border: 0;
      border-top: 1px solid #eee;
    }
    
    .comment-input-wrapper {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-top: 10px;
    }
    
    .comment-input-wrapper input#comment {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-right: 10px;
    }
    
    .comment-input-wrapper button#post {
      background: #3F5B9A;
      color: #fff;
      border: none;
      border-radius: 3px;
      padding: 8px 12px;
      cursor: pointer;
    }
    
    .premium-notice {
      margin-top: 10px;
      display: flex;
      align-items: center;
      font-size: 0.9rem;
    }
    
    .premium-notice input#check {
      margin-right: 5px;
    }
    
    .premium-notice span {
      color: #aaa;
    }
    
    .comments-list {
      max-height: 200px;
      overflow-y: auto;
      padding-right: 5px;
      margin-top: 20px;
    }
    
    .comment {
      display: flex;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 15px;
    }
    
    .comment-avatar {
      margin-right: 15px;
    }
    
    .comment-avatar img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .comment-content {
      flex: 1;
    }
    
    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .comment-name {
      font-weight: bold;
      color: #333;
    }
    
    .comment-timestamp {
      font-size: 0.85rem;
      color: #888;
    }
    
    .comment-text {
      margin: 8px 0;
      color: #555;
      font-size: 1rem;
    }
    
    .comment-actions button {
      background: none;
      border: none;
      color: #007BFF;
      font-size: 0.9rem;
      cursor: pointer;
      margin-right: 10px;
    }
    
    .like-count {
      font-size: 0.9rem;
      color: #555;
    }
    
    @media (max-width: 768px) {
      .popup-content {
        width: 90%;
        margin: 40px auto;
        padding: 20px 15px;
      }
      
      .popup-content h2 {
        font-size: 1.5rem;
      }
      
      .comments-list {
        max-height: 160px;
      }
      
      .comment-avatar img {
        width: 40px;
        height: 40px;
      }
      
      .live-counter-container {
        width: 180px;
      }
    }
  `;

  useEffect(() => {
    // Debug pathname check
    console.log("[VerificationPopup] pathname:", location.pathname);
    
    // Check localStorage state
    const lastShown = Number(localStorage.getItem(LOCAL_STORAGE_KEY)) || 0;
    console.log("[VerificationPopup] lastShown:", lastShown, lastShown ? new Date(lastShown).toISOString() : 'never', "now:", Date.now());
    
    // Uncomment for immediate testing
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

    // Add the styles directly to the document head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = popupStyles;
    styleElement.setAttribute('data-verification-popup', 'true');
    document.head.appendChild(styleElement);

    // Step 2: Wait for FIRST_DELAY_MS before showing popup
    const popupTimer = setTimeout(() => {
      try {
        console.log('[VerificationPopup] Delay elapsed, showPopup firing NOW');
        
        // Create a simple styled popup directly
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
            // Remove the style element when done
            if (document.head.contains(styleElement)) {
              styleElement.remove();
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
      // Remove the style element when component unmounts
      const styleElement = document.querySelector('style[data-verification-popup]');
      if (styleElement) {
        styleElement.remove();
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