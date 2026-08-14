"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMode, accounts } from "@/context/mode-context";
import {
  BuildingIcon,
  ClockIcon,
  EyeIcon,
  EyeOffIcon,
  HelpIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  RefreshIcon,
  ShieldIcon,
  UsersIcon,
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
  const { loginWithAccount } = useMode();

  // Tab Login Type
  const [loginType, setLoginType] = useState<"internal" | "lembaga">("internal");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fiscalYear, setFiscalYear] = useState("2026");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  // Captcha
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2FA Modal
  const [showVerify, setShowVerify] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Forgot Password Modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw Captcha
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);

    // Noise Lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(185, 28, 28, ${0.12 + Math.random() * 0.2})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, Math.random() * h);
      ctx.lineTo(Math.random() * w, Math.random() * h);
      ctx.stroke();
    }

    // Characters
    ctx.font = "bold 20px 'Courier New', monospace";
    ctx.fillStyle = "#991b1b";
    for (let i = 0; i < captcha.length; i++) {
      ctx.save();
      ctx.translate(14 + i * 22, 28);
      ctx.rotate((Math.random() - 0.5) * 0.5);
      ctx.fillText(captcha[i], 0, 0);
      ctx.restore();
    }

    // Noise Dots
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `rgba(153, 27, 27, ${0.1 + Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [captcha]);

  // Resend Timer countdown for 2FA
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showVerify && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showVerify, resendTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError(loginType === "internal" ? "Alamat email dinas wajib diisi." : "Email / NIK / ID Lembaga wajib diisi.");
      return;
    }
    if (!password) {
      setError("Kata sandi wajib diisi.");
      return;
    }
    if (captchaInput.trim().toUpperCase() !== captcha && captchaInput.trim() !== "") {
      setError("Kode captcha keamanan tidak sesuai. Silakan coba lagi.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerifyCode("");
      setVerifyError("");
      setResendTimer(60);
      setShowVerify(true);
    }, 600);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError("");

    if (!verifyCode || verifyCode.length < 4) {
      setVerifyError("Masukkan kode verifikasi yang valid (min. 4-6 digit).");
      return;
    }

    setVerifying(true);
    setTimeout(() => {
      const matched =
        accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase()) ||
        accounts[0];

      loginWithAccount(matched.id);
      router.push("/");
    }, 600);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSent(true);
    }, 800);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10 placeholder:text-slate-400";

  return (
    <>
      {/* Header Form */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Masuk ke Akun
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Akses portal Sistem Pengarsipan Hibah Bakesbangpol
        </p>
      </div>

      {/* Tabs Kategori Login: Internal vs Lembaga */}
      <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setLoginType("internal")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
            loginType === "internal"
              ? "bg-white text-red-700 shadow-sm shadow-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <UsersIcon className="h-4 w-4" />
          <span>Internal Kesbangpol</span>
        </button>

        <button
          type="button"
          onClick={() => setLoginType("lembaga")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
            loginType === "lembaga"
              ? "bg-white text-red-700 shadow-sm shadow-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <BuildingIcon className="h-4 w-4" />
          <span>Lembaga / Ormas</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email / ID Field */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-slate-700">
            {loginType === "internal" ? "Email Akun Dinas" : "Email / NIK / No. Registrasi Ormas"}
          </label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={loginType === "internal" ? "nama@kesbangpol.go.id" : "email@lembaga.org / 3273..."}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-bold text-slate-700">
              Kata Sandi / Password
            </label>
            <button
              type="button"
              onClick={() => {
                setForgotSent(false);
                setForgotEmail(email);
                setShowForgotPassword(true);
              }}
              className="text-xs font-semibold text-red-700 hover:text-red-800 hover:underline"
            >
              Lupa Password?
            </button>
          </div>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Masukkan kata sandi Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-11`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition-colors hover:text-slate-600"
              aria-label={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
            >
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Tahun Anggaran Selection */}
        <div>
          <label htmlFor="fiscalYear" className="mb-1.5 block text-xs font-bold text-slate-700">
            Tahun Anggaran Hibah
          </label>
          <div className="relative">
            <ClockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              id="fiscalYear"
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
              disabled={loading}
            >
              <option value="2026">Tahun Anggaran 2026 (Aktif / Berjalan)</option>
              <option value="2025">Tahun Anggaran 2025 (Arsip Pelaporan)</option>
              <option value="2024">Tahun Anggaran 2024 (Arsip Riwayat)</option>
            </select>
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
              ▼
            </div>
          </div>
        </div>

        {/* Captcha Security */}
        <div>
          <label htmlFor="captcha" className="mb-1.5 block text-xs font-bold text-slate-700">
            Kode Keamanan Captcha
          </label>
          <div className="flex items-stretch gap-2.5">
            <div className="shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner">
              <canvas ref={canvasRef} width={120} height={46} aria-hidden="true" />
            </div>
            <input
              id="captcha"
              type="text"
              autoComplete="off"
              maxLength={5}
              placeholder="Ketik 5 Kode"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-center text-sm font-mono font-bold tracking-widest text-slate-800 outline-none transition focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10 uppercase"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setCaptcha(generateCaptcha())}
              disabled={loading}
              className="flex w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700 hover:border-red-200"
              title="Ganti Kode Captcha"
              aria-label="Muat ulang kode captcha"
            >
              <RefreshIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs font-medium text-slate-600">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 rounded accent-red-700 cursor-pointer"
            />
            <span>Ingat akun di perangkat ini</span>
          </label>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-medium text-red-700"
          >
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-800 hover:to-rose-800 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-red-700/25 active:scale-[0.99]"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              <span>Memproses Autentikasi...</span>
            </>
          ) : (
            <span>Masuk ke Dashboard</span>
          )}
        </button>

        {/* Footer Security Badge */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldIcon className="h-3.5 w-3.5 text-emerald-600" />
          <span>Koneksi Terenkripsi SSL & Protokol Keamanan Daerah</span>
        </div>
      </form>

      {/* ========================================================= */}
      {/* MODAL 2FA: Verifikasi Keamanan Kode OTP                  */}
      {/* ========================================================= */}
      {showVerify && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                <MailIcon className="h-6 w-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowVerify(false)}
                disabled={verifying}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                aria-label="Tutup"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Verifikasi Kode Keamanan
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              Masukkan kode verifikasi 6 digit yang dikirimkan ke email terdaftar:{" "}
              <span className="font-bold text-slate-800">{email || "akun Anda"}</span>
            </p>

            <form onSubmit={handleVerify} noValidate className="mt-6 space-y-4">
              <div>
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
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-center text-2xl tracking-[0.4em] font-bold text-slate-900 outline-none transition focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10 placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-300"
                  disabled={verifying}
                />
                {verifyError && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <InfoIcon className="h-4 w-4 shrink-0" />
                    <span>{verifyError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-800 hover:to-rose-800 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-red-700/25"
              >
                {verifying ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <span>Verifikasi & Masuk</span>
                )}
              </button>

              <div className="text-center pt-2">
                {resendTimer > 0 ? (
                  <p className="text-xs text-slate-400">
                    Kirim ulang kode dalam <span className="font-bold text-slate-700">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setResendTimer(60);
                      setVerifyError("");
                    }}
                    className="text-xs font-bold text-red-700 hover:underline"
                  >
                    Kirim Ulang Kode OTP
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: Lupa Kata Sandi / Bantuan Akun                     */}
      {/* ========================================================= */}
      {showForgotPassword && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <HelpIcon className="h-6 w-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                aria-label="Tutup"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Pemulihan Kata Sandi
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Masukkan alamat email terdaftar untuk menerima tautan instruksi reset kata sandi.
            </p>

            {forgotSent ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
                  <p className="font-bold">Permintaan Pemulihan Terkirim!</p>
                  <p className="mt-1 leading-relaxed">
                    Petunjuk reset kata sandi telah dikirim ke <span className="font-bold">{forgotEmail}</span>. Silakan periksa kotak masuk atau folder spam Anda.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-black transition"
                >
                  Tutup & Kembali ke Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="mb-1.5 block text-xs font-bold text-slate-700">
                    Alamat Email Terdaftar
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    placeholder="nama@kesbangpol.go.id"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 text-xs font-bold text-white transition hover:from-red-800 hover:to-rose-800"
                >
                  {forgotLoading ? "Mengirim Tautan..." : "Kirim Tautan Pemulihan"}
                </button>

                {/* Kontak Helpdesk Layanan */}
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-600 space-y-2">
                  <p className="font-bold text-slate-800">Butuh Bantuan Langsung?</p>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Layanan Helpdesk IT: (022) 4203344 (Ext. 204)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Email: bakesbangpol@bandung.go.id</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
