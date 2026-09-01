"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";

export default function CloudflareGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVerified, setIsVerified] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);

  // Paksa render ulang widget setiap kali komponen ini di-mount (termasuk pas klik back)
  useEffect(() => {
    setIsVerified(false);
    
    const renderWidget = () => {
      if ((window as any).turnstile && turnstileRef.current) {
        try {
          turnstileRef.current.innerHTML = "";
          (window as any).turnstile.render(turnstileRef.current, {
            sitekey: "0x4AAAAAAEimNNtd-Ih_m4ql",
            callback: () => {
              setTimeout(() => setIsVerified(true), 500);
            },
          });
        } catch (e) {
          console.error("Gagal render Turnstile:", e);
        }
      }
    };

    if (scriptLoaded) {
      renderWidget();
    } else {
      const timer = setInterval(() => {
        if ((window as any).turnstile) {
          setScriptLoaded(true);
          renderWidget();
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [scriptLoaded]);

  if (isVerified) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white to-red-50 font-poppins p-6">
      {/* Script Cloudflare Turnstile dengan parameter cache-busting */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 rounded-[2rem] bg-white p-8 text-center shadow-2xl shadow-red-900/10 ring-1 ring-slate-100/50">
        {/* Spinner Animasi */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-slate-100 border-t-red-600"></div>
        </div>

        {/* Teks Konten */}
        <div className="mb-8 space-y-2.5">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            Memverifikasi keamanan...
          </h2>
          <p className="text-sm leading-relaxed text-slate-500">
            <span className="font-semibold text-red-600">hibah-kesbangpol.go.id</span>{" "}
            membutuhkan waktu sesaat untuk memeriksa keamanan browser Anda sebelum melanjutkan ke portal.
          </p>
        </div>

        {/* Container Widget Cloudflare */}
        <div className="mx-auto flex w-full justify-center overflow-hidden min-h-[65px]">
          <div ref={turnstileRef}></div>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
          <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Koneksi aman terlindungi
        </div>
      </div>
    </div>
  );
}