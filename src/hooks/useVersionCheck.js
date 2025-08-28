import { useEffect, useRef } from "react";

export const useVersionCheck = (interval = 30000) => {
  const currentVersion = useRef(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch(`/portal-vendor/version.json?ts=${Date.now()}`); // prevent caching
        const data = await res.json();

        if (!data?.version) {
          console.warn("⚠️ version.json missing 'version' field");
          return;
        }

        if (!currentVersion.current) {
          currentVersion.current = data.version;
          console.log(`Current Version ${currentVersion.current}`);
        } else if (data.version !== currentVersion.current) {
          console.log(
            `🔄 New version detected (${data.version}), reloading...`
          );
          window.location.reload();
        }
      } catch (err) {
        console.warn("❌ Version check failed:", err);
      }
    };

    const timer = setInterval(checkVersion, interval);
    return () => clearInterval(timer);
  }, [interval]);
};
