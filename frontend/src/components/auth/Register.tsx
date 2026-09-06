import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { auth } from "../../api/firebase";
import AuthBackground from "../backgrounds/AuthBackground";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      setSuccess("Account created successfully🎉");
      setTimeout(() => navigate("/"), 700);
    } catch (error: any) {
    console.error("Firebase registration error:", error);
    console.error("Firebase error code:", error?.code);
    console.error("Firebase error message:", error?.message);

    setError(getAuthError(error.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
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
            Create your account
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Start building your personal workspace.
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
            onClick={handleGoogleRegister}
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

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="register-email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="register-email"
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
              <label
                htmlFor="register-password"
                className="mb-1.5 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-sm font-medium"
              >
                Confirm password
              </label>

              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your password again"
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
                  Create account
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

          {/* Login */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-foreground hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground/60">
          Your account and data are securely managed through Firebase.
        </p>
      </motion.div>
    </main>
  );
}

function getAuthError(code: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account already exists with this email.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Please choose a stronger password.";

    case "auth/popup-closed-by-user":
      return "The Google sign-in window was closed.";

    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in popup.";

    default:
      return "Something went wrong. Please try again.";
  }
}
