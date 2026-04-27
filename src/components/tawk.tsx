// components/tawk.tsx
"use client";

import { useEffect } from "react";

export function TawkScript() {
  useEffect(() => {
    if ((window as any).Tawk_API) return;

    var Tawk_API = {};
    var Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];

    s1.async = true;
    s1.src = "https://embed.tawk.to/69edecdc31efa51c38a25713/1jn4mag2o";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    s0.parentNode?.insertBefore(s1, s0);
  }, []);

  return null;
}