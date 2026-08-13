"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  MailIcon,
  RefreshIcon,
  XIcon,
} from "./icons";

const captchaChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const generateCaptcha = () =>
  Array.from(
    { length: 5 },
    () => captchaChars[Math.floor(Math.random() * captchaChars.length)],
  ).join("");

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    // Latar belakang
    ctx.fillStyle = "#f1f4fb";
    ctx.fillRect(0, 0, w, h);

    // Garis noise
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(26, 35, 126, ${0.08 + Math.random() * 0.25})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, Math.random() * h);
      ctx.lineTo(Math.random() * w, Math.random() * h);
      ctx.stroke();
    }

    // Karakter kode
    ctx.font = "bold 22px 'Courier New', monospace";
    ctx.fillStyle = "#1A237E";
    for (let i = 0; i < captcha.length; i++) {
      ctx.save();
      ctx.translate(16 + i * 24, 30);
      ctx.rotate((Math.random() - 0.5) * 0.6);
      ctx.fillText(captcha[i], 0, 0);
      ctx.restore();
    }

    // Titik noise
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = `rgba(26, 35, 126, ${0.05 + Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [captcha]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email wajib diisi.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }
    if (!password) {
      setError("Kata sandi wajib diisi.");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (!captchaInput.trim()) {
      setError("Kode captcha wajib diisi.");
      return;
    }
    if (captchaInput.trim().toUpperCase() !== captcha) {
      setError("Kode captcha salah.");
      return;
    }

    setLoading(true);
    // Simulasi proses autentikasi
    setTimeout(() => {
      setLoading(false);
      setVerifyCode("");
      setVerifyError("");
      setShowVerify(true);
    }, 900);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError("");

    if (!verifyCode.trim()) {
      setVerifyError("Kode verifikasi wajib diisi.");
      return;
    }

    setVerifying(true);
    setTimeout(() => {
      if (verifyCode.trim() === "123456") {
        router.push("/");
      } else {
        setVerifying(false);
        setVerifyError("Kode verifikasi salah.");
      }
    }, 800);
  };

  const errorId = "login-error";

  const inputClass =
    "w-full rounded-[3px] border border-zinc-300 bg-white px-2 py-3 text-sm text-zinc-800 outline-none transition focus:border-[#304FFE] focus:ring-2 focus:ring-[#304FFE]/10 placeholder:font-light placeholder:text-zinc-400";

  return (
    <>
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Heading */}
      <h6 className="text-lg font-semibold text-zinc-900">
        Silahkan Masuk Dengan Akun Anda
      </h6>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-zinc-200" />
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      {/* Alamat Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm text-zinc-800"
        >
          Alamat Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Masukan Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          disabled={loading}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </div>

      {/* Password */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="block text-sm text-zinc-800">
            Password
          </label>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-xs text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Lupa Password?
          </a>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Masukan Password Anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} pr-11`}
            disabled={loading}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 transition-colors hover:text-zinc-600"
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Captcha */}
      <div>
        <label htmlFor="captcha" className="mb-1.5 block text-sm text-zinc-800">
          Captcha
        </label>
        <div className="flex items-stretch gap-2">
          <div className="shrink-0 overflow-hidden rounded-[3px] border border-zinc-300 bg-[#f1f4fb]">
            <canvas ref={canvasRef} width={130} height={44} aria-hidden="true" />
          </div>
          <input
            id="captcha"
            type="text"
            autoComplete="off"
            maxLength={5}
            placeholder="Masukan Kode Disamping"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
            className={`${inputClass} min-w-0`}
            disabled={loading}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
          <button
            type="button"
            onClick={() => setCaptcha(generateCaptcha())}
            disabled={loading}
            className="flex w-10 shrink-0 items-center justify-center rounded-[3px] border border-zinc-300 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
            aria-label="Muat ulang kode captcha"
            title="Muat ulang kode"
          >
            <RefreshIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Ingat saya */}
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-zinc-600">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 accent-[#1A237E]"
          />
          Ingat saya
        </label>
      </div>

      {/* Error */}
      {error && (
        <div
          id={errorId}
          role="alert"
          className="flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Tombol Login */}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-44 items-center justify-center gap-2 rounded-[3px] bg-[#1A237E] text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Proses...
          </>
        ) : (
          "Login"
        )}
      </button>

      {/* Demo hint */}
      <p className="pt-1 text-xs text-zinc-400">
        Akun demo: <span className="font-semibold text-zinc-600">admin@kesbangpol.go.id</span>{" "}
        / <span className="font-semibold text-zinc-600">admin123</span>
      </p>
    </form>

    {/* Modal verifikasi email */}
    {showVerify && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="verify-title"
      >
        <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-2xl">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1A237E]/10 text-[#1A237E]">
              <MailIcon className="h-6 w-6" />
            </div>
            <button
              type="button"
              onClick={() => setShowVerify(false)}
              disabled={verifying}
              className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Tutup"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          <h3 id="verify-title" className="mt-5 text-xl font-semibold text-zinc-900">
            Verifikasi Email
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-zinc-500">
            Masukkan kode verifikasi 6 digit yang dikirim ke{" "}
            <span className="font-semibold text-zinc-700">{email}</span>
          </p>

          <form onSubmit={handleVerify} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="verify-code" className="mb-1.5 block text-sm text-zinc-800">
                Kode Verifikasi
              </label>
              <input
                id="verify-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                autoFocus
                placeholder="123456"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-[3px] border border-zinc-300 bg-white px-3 py-3 text-center text-lg tracking-[0.4em] text-zinc-800 outline-none transition focus:border-[#304FFE] focus:ring-2 focus:ring-[#304FFE]/10 placeholder:tracking-normal placeholder:font-light placeholder:text-zinc-300"
                disabled={verifying}
                aria-invalid={verifyError ? true : undefined}
              />
              {verifyError && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                  <InfoIcon className="h-4 w-4 shrink-0" />
                  {verifyError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[3px] bg-[#1A237E] text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {verifying ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Memverifikasi...
                </>
              ) : (
                "Verifikasi"
              )}
            </button>

            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-zinc-400">
              <MailIcon className="h-3.5 w-3.5" />
              Kode demo: <span className="font-semibold text-zinc-600">123456</span>
            </p>
          </form>
        </div>
      </div>
    )}
    </>
  );
}
