'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/actions"; // This is your Server Action

export default function RegisterPage() {
  const [status, setStatus] = useState<{ msg: string; isError: boolean } | null>(null);
  const router = useRouter();

  // 1. Define the handleSubmit function
  async function handleSubmit(formData: FormData) {
    // Clear status and start the process
    setStatus(null);

    // 2. Call the Server Action
    const result = await registerUser(formData);

    // 3. Handle the result based on the 'success' property
    if (result.success) {
      setStatus({ msg: result.message, isError: false });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setStatus({ msg: result.message, isError: true });
    }
  }

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="card shadow-sm border-0 p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-primary fw-bold text-center mb-4">Patient Registration</h2>
        
        {status && (
          <div className={`alert ${status.isError ? 'alert-danger' : 'alert-success'} text-center py-2 small`}>
            {status.msg}
          </div>
        )}

        {/* 4. The form now correctly references handleSubmit */}
        <form action={handleSubmit}>
          {/* Important: Changed 'name' to 'username' to match your Prisma schema */}
          <div className="mb-3">
            <label className="form-label text-secondary small fw-bold">Username</label>
            <input name="username" type="text" className="form-control shadow-none" required />
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary small fw-bold">Password</label>
            <input name="password" type="password" className="form-control shadow-none" required />
          </div>

          {/* ... Rest of your inputs (icNumber, bloodType, email, phoneNumber, age) ... */}
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-secondary small fw-bold">IC Number</label>
              <input name="icNumber" type="text" className="form-control shadow-none" required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-secondary small fw-bold">Blood Type</label>
              <select name="bloodType" className="form-select shadow-none" required>
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="AB+">AB+</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary small fw-bold">Email Address</label>
            <input name="email" type="email" className="form-control shadow-none" required />
          </div>

          <div className="row">
            <div className="col-md-8 mb-3">
              <label className="form-label text-secondary small fw-bold">Phone Number</label>
              <input name="phoneNumber" type="text" className="form-control shadow-none" required />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label text-secondary small fw-bold">Age</label>
              <input name="age" type="number" min="10" className="form-control shadow-none" required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 btn-lg mt-3 shadow-none">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}