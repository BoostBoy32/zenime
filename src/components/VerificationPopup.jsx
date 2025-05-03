import { useEffect, useState } from 'react';

const VerificationPopup = () => {
  /*
  // State for controlling instructions visibility
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Constants for time rules
  const FIRST_DELAY_MS = 120_000; // 2 minutes
  const SHOW_TIME_MS = 6 * 60 * 1000; // 6 minutes
  const WEEKLY_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  // Function to show the popup
  const showPopup = () => {
    const popup = document.getElementById('human-verification-popup');
    if (popup) {
      popup.style.display = 'block';
    }
  };

  // Function to hide the popup
  const hidePopup = () => {
    const popup = document.getElementById('human-verification-popup');
    if (popup) {
      popup.style.display = 'none';
      localStorage.setItem('lastPopupTime', Date.now().toString());
    }
  };

  // Handler for the Verify Now button
  const handleVerifyClick = () => {
    // Check if the global _gD function exists before calling it
    if (typeof window._gD === 'function') {
      console.log('Verification function called');
      window._gD();
    } else {
      console.warn('Verification script not loaded yet');
      // Fallback to our own implementation if external script hasn't loaded
      window.open("https://example.com/verification", "_blank");
    }
  };

  useEffect(() => {
    // Tell the external script that React is managing the popup
    window.popupManagedByReact = true;

    // Set up popup visibility based on timing rules
    const now = Date.now();
    const popupStartTime = localStorage.getItem('popupStartTime');
    const lastPopupTime = localStorage.getItem('lastPopupTime');

    // Determine if popup should be shown
    const shouldShowPopup = () => {
      // Show if weekly interval has passed since last showing
      if (!lastPopupTime || now - parseInt(lastPopupTime, 10) >= WEEKLY_INTERVAL_MS) {
        return true;
      }
      // Show if within the show time window
      if (popupStartTime && now - parseInt(popupStartTime, 10) < SHOW_TIME_MS) {
        return true;
      }
      return false;
    };

    // Show popup based on timing rules
    if (shouldShowPopup()) {
      if (popupStartTime) {
        // Show instantly if within the show time window
        showPopup();
      } else {
        // Set a timeout for first-time visitors
        const timerId = setTimeout(() => {
          localStorage.setItem('popupStartTime', Date.now().toString());
          showPopup();
        }, FIRST_DELAY_MS);
        return () => clearTimeout(timerId);
      }

      // Auto-hide after SHOW_TIME_MS
      if (popupStartTime) {
        const remainingTime = SHOW_TIME_MS - (now - parseInt(popupStartTime, 10));
        if (remainingTime > 0) {
          const hideTimerId = setTimeout(hidePopup, remainingTime);
          return () => clearTimeout(hideTimerId);
        } else {
          hidePopup();
        }
      }
    }
  }, []);

  // External function used by verify button
  const _gD = () => {
    // This function will be called when the verify button is clicked
    console.log("Verification button clicked");
    window.open("https://example.com/verification", "_blank");
  };

  // Expose the _gD function to the global scope
  useEffect(() => {
    window._gD = _gD;
    
    return () => {
      delete window._gD;
    };
  }, []);
  */

  // The component doesn't render anything anymore - All functionality is disabled
  return null;

  /*
  // Original JSX return
  return (
    // Inline the popup HTML, converted to JSX
    <div id="human-verification-popup" className="popup-overlay" style={{ display: 'none' }}>
      <div className="popup-content">
        <img src="https://animesobt.great-site.net/logo.png" alt="Logo" className="popup-logo" />
        <h2>Human Verification Required</h2>
        <p>Honored user, kindly complete a quick verification to start streaming.</p>
        <button 
          className="verify-btn" 
          id="verify-btn" 
          onClick={handleVerifyClick}
        >
          Verify Now
        </button>
        <p className="instructions">
          Simply click <strong>"Verify Now"</strong>, to view available task. Please, Complete one task and your access will be unlocked instantly!!
        </p>
        <a 
          className="how-to-btn" 
          href="#" 
          id="how-to-btn" 
          onClick={(e) => {
            e.preventDefault();
            setShowInstructions(prev => !prev);
          }}
        >
          How to Verify
        </a>
        <p>Safe and Secure:</p>
        <div id="instructions-container" style={{ display: showInstructions ? 'block' : 'none' }}>
          <div className="instruction-section">
            <h3>How to Complete Verification</h3>
            <p>1. Click the "Verify Now" button above</p>
            <p>2. Complete one of the available tasks (usually takes less than 30 seconds)</p>
            <p>3. After completion, you'll gain instant access to all content</p>
            <p>Note: Verification helps us maintain our free service by filtering out bots</p>
          </div>
        </div>
        
        <div className="live-counter-container">
          <div className="counter-icon">
            <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24">
              <path d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm0 2c-2.67 0-8 1.337-8 4v2h16v-2c0-2.663-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="counter-details">
            <div className="counter-text">
              <span className="counter-number" id="onlineCounter">5993</span>
              <span className="counter-label">Users Online</span>
            </div>
            <div className="live-indicator"></div>
          </div>
        </div>
        
        <div className="comments-container">
          <div className="comments-header">
            <b>1725+ Comments</b>
            <hr />
          </div>
          <div className="comment-input-wrapper">
            <input type="text" id="comment" placeholder="Add a Comment..." />
            <button id="post">Post</button>
          </div>
          <div className="premium-notice">
            <input id="check" type="checkbox" />
            <span>Only premium members can comment</span>
          </div>
          <div className="comments-list" id="commentsList">
            <div className="comment" data-comment-id="1" data-offset="5">
              <div className="comment-avatar">
                <img src="https://animesobt.great-site.net/Profile2/Wesley.jpg" alt="Profile Picture" />
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-name">Wesley Allen</span>
                  <span className="comment-timestamp">5 seconds ago</span>
                </div>
                <p className="comment-text">Worked for me on the first try! Make sure to follow instructions exactly.</p>
                <div className="comment-actions">
                  <button>Like</button> <span className="like-count">1 Like</span> · 
                  <button>Reply</button>
                </div>
              </div>
            </div>
            <div className="comment" data-comment-id="2" data-offset="37">
              <div className="comment-avatar">
                <img src="https://animesobt.great-site.net/Profile2/Trevor.jpg" alt="Profile Picture" />
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-name">Trevor Anderson</span>
                  <span className="comment-timestamp">37 seconds ago</span>
                </div>
                <p className="comment-text">Installed Opera GX on my desktop and got verified in a flash. Smooth and super fast!</p>
                <div className="comment-actions">
                  <button>Like</button> <span className="like-count">3 Likes</span> · 
                  <button>Reply</button>
                </div>
              </div>
            </div>
            <div className="comment" data-comment-id="3" data-offset="60">
              <div className="comment-avatar">
                <img src="https://animesobt.great-site.net/Profile2/Connor.jpg" alt="Profile Picture" />
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-name">Connor Miller</span>
                  <span className="comment-timestamp">1 minute ago</span>
                </div>
                <p className="comment-text">Best trick Guys, if you see 'Run the app (new user only)', just install it and run for 30 seconds.</p>
                <div className="comment-actions">
                  <button>Like</button> <span className="like-count">5 Likes</span> · 
                  <button>Reply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  */
};

export default VerificationPopup; 