'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/actions";

export default function LoginPage() {
  const [status, setStatus] = useState<{ msg: string; isError: boolean } | null>(null);
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
        isError: false 
      });
      
      setTimeout(() => {
        window.location.href = result.redirectTo || "/dashboard"; 
      }, 1000);
    } else {
      setStatus({ msg: result.message ?? "Login failed", isError: true });
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="card shadow-sm border-0 p-4" style={{ maxWidth: "400px", width: "100%" }}>
        {/* Changed title to be neutral for both Admin and Patient */}
        <h2 className="text-primary fw-bold text-center mb-4">Medfix Login</h2>
        
        {status && (
          <div className={`alert ${status.isError ? 'alert-danger' : 'alert-success'} text-center py-2 small`}>
            {status.msg}
          </div>
        )}

        <form action={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary small fw-bold">Email Address</label>
            <input 
              name="email" 
              type="email" 
              className="form-control shadow-none" 
              placeholder="example@mail.com"
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-secondary small fw-bold">Password</label>
            <input 
              name="password" 
              type="password" 
              className="form-control shadow-none" 
              placeholder="Enter your password"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-100 btn-lg shadow-none"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
          
          <div className="text-center mt-4">
            <p className="small text-muted mb-0">
              Don't have an account? 
              <a href="/register" className="text-primary fw-bold text-decoration-none ms-1">
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}