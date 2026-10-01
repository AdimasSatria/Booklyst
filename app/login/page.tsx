"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Loader2, AlertCircle, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const CAMPUS_DOMAIN = "@student.upnjatim.ac.id";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);

  const trimmedEmail = email.trim();
  const isValidCampusEmail =
    trimmedEmail.length > 0 && trimmedEmail.toLowerCase().endsWith(CAMPUS_DOMAIN);

  const showEmailError = touchedEmail && trimmedEmail.length > 0 && !isValidCampusEmail;
  const isDisabled = !isValidCampusEmail || !password || (mode === "register" && !fullName.trim());

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled || isSubmitting) return;

    setIsSubmitting(true);
    setTimeout(() => {
      login(trimmedEmail, fullName);
      router.push("/");
    }, 1000);
  };

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setTouchedEmail(false);
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-14 h-14 bg-[#8B9A6E] rounded-2xl flex items-center justify-center shadow-lg shadow-[#8B9A6E]/25 mb-4">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Booklyst</h1>
          <p className="text-sm text-neutral-500 mt-1">Platform sirkular civitas akademika UPN Veteran Jatim</p>
        </motion.div>

        {/* Toggle */}
        <div className="flex bg-neutral-100 p-1.5 rounded-full mb-8">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="flex-1 relative z-10 py-2.5 text-sm font-bold rounded-full transition-colors"
            >
              <span className={mode === m ? "text-white" : "text-neutral-500 hover:text-neutral-800"}>
                {m === "login" ? "Masuk" : "Daftar"}
              </span>
              {mode === m && (
                <motion.div
                  layoutId="activeAuthTab"
                  className="absolute inset-0 bg-[#8B9A6E] rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama lengkap kamu"
                    className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-full
                               focus:border-[#8B9A6E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B9A6E]/15
                               transition-all text-sm placeholder-neutral-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">Email Kampus</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouchedEmail(true)}
                  placeholder="nama@student.upnjatim.ac.id"
                  className={`w-full pl-11 pr-4 py-3.5 bg-neutral-50 border rounded-full
                              focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm placeholder-neutral-400
                              ${showEmailError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-neutral-200 focus:border-[#8B9A6E] focus:ring-[#8B9A6E]/15"
                    }`}
                />
              </div>
              <AnimatePresence>
                {showEmailError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1.5 pl-4 mt-2 overflow-hidden"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <p className="text-xs text-red-500">
                      Gunakan email kampus (@student.upnjatim.ac.id) untuk melanjutkan.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-full
                             focus:border-[#8B9A6E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B9A6E]/15
                             transition-all text-sm placeholder-neutral-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isDisabled || isSubmitting}
              className="w-full mt-2 py-4 bg-[#8B9A6E] text-white font-bold rounded-full
                         hover:bg-[#7a8a5d] transition-all shadow-lg shadow-[#8B9A6E]/20
                         disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>{mode === "login" ? "Masuk" : "Daftar"}</span>
              )}
            </button>
          </motion.form>
        </AnimatePresence>

        <p className="text-center text-xs text-neutral-400 mt-8 leading-relaxed">
          {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
          <button
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            className="font-bold text-[#8B9A6E] hover:underline transition-all"
          >
            {mode === "login" ? "Daftar di sini" : "Masuk di sini"}
          </button>
        </p>
      </div>
    </main>
  );
}
