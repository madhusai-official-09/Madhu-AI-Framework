import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { auth } from "../../api/firebase";
import AuthBackground from "../backgrounds/AuthBackground";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  async function handleForgotPassword() {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());

      setSuccess("Password reset email sent. Check your inbox.");
    } catch (error: any) {
      console.error("Password reset error:", error);

      setError(getAuthError(error.code));
    } finally {
      setResetLoading(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      setSuccess("Signed in successfully🎉");
      setTimeout(() => navigate("/"), 700);
    } catch (error: any) {
      setError(getAuthError(error.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);
    } catch (error: any) {
      setError(getAuthError(error.code));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="mx-auto mb-5 flex size-11 items-center justify-center rounded-xl border border-border bg-muted/40 shadow-sm"
          >
            <Sparkles className="size-5" />
          </motion.div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to Madhu AI.
          </p>
        </div>

        {/* Card */}
        <div
          className="
    relative overflow-hidden rounded-2xl
    border border-white/15
    bg-white/[0.06]
    p-6
    shadow-2xl shadow-black/30
    backdrop-blur-2xl
    backdrop-saturate-150
  "
        >
          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="
              flex h-11 w-full items-center justify-center gap-3
              rounded-xl border border-border
              bg-background
              text-sm font-medium
              transition-all
              hover:bg-accent
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {googleLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <span className="text-sm font-semibold">G</span>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="text-[10px] font-medium tracking-widest text-muted-foreground">
              OR
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="
                  h-11 w-full rounded-xl
                  border border-white/10
                  bg-white/0.06
                  px-3 text-sm
                  outline-none
                  transition
                  placeholder:text-muted-foreground
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                "
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading || loading || googleLoading}
                  className="
    text-xs text-muted-foreground
    transition
    hover:text-foreground
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
                >
                  {resetLoading ? "Sending..." : "Forgot password?"}
                </button>
              </div>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="
                  h-11 w-full rounded-xl
                  border border-white/10
                  bg-white/0.06
                  px-3 text-sm
                  outline-none
                  transition
                  placeholder:text-muted-foreground
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                "
              />
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="
      rounded-xl
      border border-emerald-400/20
      bg-emerald-400/10
      px-3 py-2.5
      text-xs
      text-emerald-300
    "
              >
                {success}
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="
                  rounded-xl
                  border border-destructive/20
                  bg-destructive/5
                  px-3 py-2.5
                  text-xs
                  text-destructive
                "
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="
                group flex h-11 w-full
                items-center justify-center gap-2
                rounded-xl
                bg-foreground
                text-sm font-medium
                text-background
                transition-all
                hover:opacity-90
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight
                    className="
                      size-4
                      transition-transform
                      group-hover:translate-x-0.5
                    "
                  />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-foreground hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground/60">
          Your account and data are securely managed through Firebase🔥.
        </p>
      </motion.div>
    </main>
  );
}

function getAuthError(code: string) {
  switch (code) {
    case "auth/invalid-credential":
      return "The email or password is incorrect.";

    case "auth/user-not-found":
      return "No account was found with this email.";

    case "auth/wrong-password":
      return "The password is incorrect.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/popup-closed-by-user":
      return "The Google sign-in window was closed.";

    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in popup.";

    case "auth/missing-email":
      return "Enter your email address first.";

    default:
      return "Something went wrong. Please try again.";
  }
}

