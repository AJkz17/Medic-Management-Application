'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/actions";

export default function LoginPage() {
  const [status, setStatus] = useState<{
    msg: string;
    isError: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setStatus(null);

    const result = await loginUser(formData);

    if (result.success) {
      router.refresh();

      setStatus({
        msg: result.message ?? "Login successful!",
        isError: false,
      });

      setTimeout(() => {
        window.location.href = result.redirectTo || "/dashboard";
      }, 1000);
    } else {
      setStatus({
        msg: result.message ?? "Login failed",
        isError: true,
      });

      setLoading(false);
    }
  }

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">

      <div
        className="card shadow-sm border-0 p-4"
        style={{
          maxWidth: "400px",
          width: "100%",
        }}
      >
        {/* Title */}
        <h2 className="text-primary fw-bold text-center mb-4">
          Medfix Login
        </h2>

        {/* Login Status */}
        {status && (
          <div
            className={`alert ${
              status.isError ? "alert-danger" : "alert-success"
            } text-center py-2 small`}
          >
            {status.msg}
          </div>
        )}

        {/* Normal Login Form */}
        <form action={handleSubmit}>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label text-secondary small fw-bold">
              Email Address
            </label>

            <input
              name="email"
              type="email"
              className="form-control shadow-none"
              placeholder="example@mail.com"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label text-secondary small fw-bold">
              Password
            </label>

            <input
              name="password"
              type="password"
              className="form-control shadow-none"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 btn-lg shadow-none"
          >
            {loading ? "Verifying..." : "Login"}
          </button>

        </form>

        {/* Divider */}
        <div className="text-center my-3 text-muted small">
          OR
        </div>

        {/* Google Login */}
        <a
          href="/api/auth/google"
          className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2"
        >
          {/* Google Logo */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.8 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.3-.1-2.5-.4-3.5z"
            />

            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
            />

            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.4 26.7 36 24 36c-5.2 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"
            />

            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2C40.9 36 44 30.9 44 24c0-1.3-.1-2.5-.4-3.5z"
            />
          </svg>

          Continue with Google
        </a>

        {/* Register */}
        <div className="text-center mt-4">
          <p className="small text-muted mb-0">
            Don't have an account?

            <a
              href="/register"
              className="text-primary fw-bold text-decoration-none ms-1"
            >
              Register here
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}