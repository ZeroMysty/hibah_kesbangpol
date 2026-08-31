"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import CloudflareGate from "@/components/cloudflare-gate";
import { useMode, accounts } from "@/context/mode-context";
import {
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
  XIcon,
} from "./icons";

export default function LoginForm() {
  const router = useRouter();
  const { loginWithAccount } = useMode();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [remember, setRemember] = useState(false);

  // Efek khusus untuk nge-render Turnstile secara paksa begitu elemen div-nya siap di DOM
  useEffect(() => {
    const timer = setInterval(() => {
      if ((window as any).turnstile) {
        const container = document.getElementById("login-turnstile-container");
        if (container && container.innerHTML === "") {
          (window as any).turnstile.render("#login-turnstile-container", {
            sitekey: "0x4AAAAAAEimNNtd-Ih_m4ql",
            callback: (token: string) => {
              (window as any).loginCfToken = token;
              setError("");
            },
          });
          clearInterval(timer);
        }
      }
    }, 200);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Alamat email wajib diisi.");
      return;
    }
    if (!password) {
      setError("Kata sandi wajib diisi.");
      return;
    }
    
    // Cek token dari variabel global
    if (!(window as any).loginCfToken) {
      setError("Selesaikan verifikasi keamanan (Cloudflare) terlebih dahulu.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerifyCode("");
      setVerifyError("");
      setShowVerify(true);
    }, 600);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError("");
    setVerifying(true);
    setTimeout(() => {
      const matched =
        accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase()) ||
        accounts[0];
      const acc = loginWithAccount(matched.id);
      router.push(`/portal/u/${acc.userIndex || "0"}/${acc.sessionToken}/${acc.rolePath}/Beranda`);
    }, 600);
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm font-poppins text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10";

  return (
    <CloudflareGate>
      {/* Script wajib Cloudflare */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
      />

      {/* Header */}
      <div className="mb-7 font-poppins">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Selamat Datang
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Masuk ke portal Pengarsipan Hibah Bakesbangpol
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 font-poppins">
        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-zinc-700">
            Email Akun Dinas
          </label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="nama@kesbangpol.go.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputClass} pl-10`}
              disabled={loading}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-zinc-700">
            Kata Sandi
          </label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pl-10 pr-11`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-400 transition hover:text-zinc-600"
              aria-label={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
            >
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-medium text-zinc-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-3.5 w-3.5 rounded accent-red-600"
            />
            Ingat saya
          </label>
          <span className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer hover:underline">
            Lupa Password?
          </span>
        </div>

        {/* --- WIDGET CLOUDFLARE TURNSTILE (Target ID) --- */}
        <div className="flex justify-center py-2">
          <div id="login-turnstile-container"></div>
        </div>
        {/* ---------------------------------------------- */}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-medium text-red-700"
          >
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:from-red-700 hover:to-rose-800 disabled:opacity-70 active:scale-[0.99]"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              <span>Memproses...</span>
            </>
          ) : (
            <span>Masuk ke Dashboard</span>
          )}
        </button>

        {/* SSL badge */}
        <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-zinc-400">
          <ShieldIcon className="h-3.5 w-3.5 text-emerald-500" />
          <span>Koneksi aman & terenkripsi SSL</span>
        </div>
      </form>

      {/* Modal 2FA */}
      {showVerify && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm font-poppins"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                <MailIcon className="h-6 w-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowVerify(false)}
                className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <h3 className="mt-5 text-xl font-bold text-zinc-900">
              Verifikasi Kode OTP
            </h3>
            <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
              Kode 6 digit dikirim ke{" "}
              <span className="font-bold text-zinc-800">{email || "email Anda"}</span>
            </p>

            <form onSubmit={handleVerify} noValidate className="mt-6 space-y-4">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                placeholder="• • • • • •"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-center text-2xl font-bold tracking-[0.4em] text-zinc-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 placeholder:tracking-normal placeholder:font-normal placeholder:text-zinc-300"
                disabled={verifying}
              />
              {verifyError && (
                <p className="text-xs font-medium text-red-600">{verifyError}</p>
              )}
              <button
                type="submit"
                disabled={verifying}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:from-red-700 hover:to-rose-800 disabled:opacity-70"
              >
                {verifying ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Memverifikasi...
                  </>
                ) : (
                  "Verifikasi & Masuk"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </CloudflareGate>
  );
}