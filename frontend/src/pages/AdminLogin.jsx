import React from "react";
import toast from "react-hot-toast";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../services/api";

export default function AdminLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  async function submit(e) {
    e.preventDefault();
    try {
      const user = await login(form);
      if (user.role !== "ADMIN") {
        logout();
        toast.error("This login is reserved for administrators");
        return;
      }
      toast.success(`Welcome, ${user.name}`);
      navigate("/admin");
    } catch (error) {
      toast.error(apiError(error));
    }
  }

  return (
    <main className="auth-page page grid min-h-[calc(100vh-64px)] place-items-center">
      <form className="auth-card panel w-full max-w-md space-y-4 p-6" onSubmit={submit}>
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-white"><ShieldCheck size={20} /></span>
          <div>
            <h1 className="text-3xl font-extrabold">Admin Login</h1>
            <p className="mt-1 text-sm text-slate-600">Administrator access only.</p>
          </div>
        </div>
        <label><span className="label">Email</span><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label><span className="label">Password</span><input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        <button className="btn btn-primary w-full">Enter admin console</button>
        <div className="credential-box">
          <span className="credential-label">Admin credentials</span>
          <strong>admin@eventpro.local</strong>
          <span>Password: Admin@12345</span>
        </div>
      </form>
    </main>
  );
}
