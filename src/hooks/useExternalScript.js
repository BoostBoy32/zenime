import { useEffect } from 'react';

/**
 * A custom hook for dynamically loading external scripts
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.url - The URL of the script to load
 * @param {Function} [options.beforeInject] - Function to run before injecting the script
 * @param {boolean} [options.async=true] - Whether the script should load asynchronously
 * @param {boolean} [options.defer=false] - Whether the script should be deferred
 * @returns {void}
 */
export default function useExternalScript({ url, beforeInject, async = true, defer = false }) {
  useEffect(() => {
    // Run any initialization code before injecting script
    if (beforeInject) beforeInject();
    
    // Create the script element
    const script = document.createElement('script');
    script.src = url;
    script.async = async;
    script.defer = defer;
    
    // Add the script to the document
    document.head.appendChild(script);
    
    // Clean up function to remove the script when component unmounts
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [url, beforeInject, async, defer]); // Re-run if these dependencies change
} 