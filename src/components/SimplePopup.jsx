import { useEffect, useState } from "react";

export default function SimplePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // always show immediately on watch page
    setVisible(true);
  }, []);

  if (!visible) return null;
  return (
    <div
      id="simple-popup-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div style={{ background: "#fff", padding: "2rem", borderRadius: "8px" }}>
        <h2>Human Verification</h2>
        <p>Please confirm you are a human to continue watching.</p>
        <button onClick={() => setVisible(false)}>I am human</button>
      </div>
    </div>
  );
} 