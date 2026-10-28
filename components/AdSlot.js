"use client";

import { useEffect, useRef } from "react";

export default function AdSlot({
  slotId = "0000000000",
  format = "auto",
  responsive = "true",
  className = "",
  label = "Advertisement",
}) {
  const adRef = useRef(null);
  // Check if live AdSense is configured
  const clientId =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-9415893623013266";

  const hasRealClientId =
    Boolean(clientId) && clientId !== "ca-pub-XXXXXXXXXXXXXXXX";

  const isDevOrPlaceholder = !hasRealClientId;

  // Hide ads entirely if not registered with Google AdSense yet (can toggle via NEXT_PUBLIC_SHOW_ADS)
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === "true" || hasRealClientId;

  useEffect(() => {
    // Only attempt AdSense push if running in browser and real AdSense client ID is active
    if (hasRealClientId) {
      try {
        if (typeof window !== "undefined") {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error("AdSense push error:", err);
      }
    }
  }, [hasRealClientId]);

  // If ads are hidden / user has not registered AdSense yet, render nothing (board hidden)
  if (!showAds) {
    return null;
  }

  // clientId defined above

  const heightConfig = {
    horizontal: {
      className: "h-[100px] min-h-[100px]",
      intrinsic: "auto 100px",
    },
    rectangle: {
      className: "h-[280px] min-h-[280px]",
      intrinsic: "auto 280px",
    },
    vertical: {
      className: "h-[600px] min-h-[600px]",
      intrinsic: "auto 600px",
    },
  };

  const currentHeight = heightConfig[format] || heightConfig.horizontal;

  return (
    <div
      className={`my-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-200 ${currentHeight.className} ${className}`}
      style={{
        contain: "layout-size",
        containIntrinsicSize: currentHeight.intrinsic,
      }}
    >
      <div className="w-full text-center">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1 block">
          {label}
        </span>
      </div>

      {isDevOrPlaceholder ? (
        // Preview placeholder for development & before publisher ID is inserted
        <div className={`w-full ${currentHeight.className} border border-dashed border-emerald-900/60 bg-slate-900/40 rounded-lg p-3 flex flex-col items-center justify-center text-center text-slate-400 group hover:border-emerald-500/50 transition-colors`}>

          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono font-semibold text-emerald-400">
              Google AdSense Slot #{slotId}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-xs">
            Format: <span className="text-slate-300 font-medium">{format}</span> • Responsive Ad Container
          </p>
          <span className="text-[10px] text-slate-400 mt-1">
            (Replace client ID in layout to activate live ads)
          </span>
        </div>
      ) : (
        // Live production AdSense unit
        <ins
          className="adsbygoogle block w-full text-center"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      )}
    </div>
  );
}
