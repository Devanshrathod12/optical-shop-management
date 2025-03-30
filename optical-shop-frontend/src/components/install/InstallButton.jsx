import React, { useState, useEffect } from "react";
import "./InstallButton.css"; 

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallButton(true); // ✅ अब बटन दिखेगा
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          console.log("✅ User accepted the install prompt");
          setShowInstallButton(false); // ✅ Install के बाद बटन गायब हो जाएगा
        } else {
          console.log("❌ User dismissed the install prompt");
        }
      });
    }
  };

  return (
    showInstallButton && (
      <button className="install-button" onClick={handleInstallClick}>
        Install App
      </button>
    )
  );
};

export default InstallButton;
