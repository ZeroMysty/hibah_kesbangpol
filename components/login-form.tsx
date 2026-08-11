"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
} from "./icons";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    setLoading(true);
    // Simulasi proses autentikasi
    setTimeout(() => {
      router.push("/");
    }, 900);
  };

  const errorId = "login-error";

  const inputClass =
    "h-11 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-sm text-zinc-900 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10 placeholder:text-zinc-400";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-zinc-700"
        >
          Alamat Email
        </label>
        <div className="relative">
          <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="admin@kesbangpol.go.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            disabled={loading}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
            Kata Sandi
          </label>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-xs font-semibold text-red-600 transition-colors hover:text-red-500"
          >
            Lupa kata sandi?
          </a>
        </div>
        <div className="relative">
          <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Masukkan kata sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            disabled={loading}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-400 transition-colors hover:text-zinc-600"
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

      {/* Remember me */}
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-zinc-600">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 accent-red-600"
          />
          Ingat saya
        </label>
      </div>

      {/* Error */}
      {error && (
        <div
          id={errorId}
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 hover:shadow-red-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Memproses...
          </>
        ) : (
          <>
            <LockIcon className="h-4 w-4" />
            Masuk
          </>
        )}
      </button>

      {/* Demo hint */}
      <p className="rounded-xl bg-zinc-50 px-4 py-3 text-center text-xs text-zinc-500">
        Akun demo: <span className="font-semibold text-zinc-700">admin@kesbangpol.go.id</span> /{" "}
        <span className="font-semibold text-zinc-700">admin123</span>
      </p>

      <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
        <ShieldIcon className="h-3.5 w-3.5" />
        Sistem Informasi Hibah Kesbangpol
      </p>
    </form>
  );
}
