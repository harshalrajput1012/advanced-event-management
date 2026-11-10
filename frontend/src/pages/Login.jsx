import React from "react";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  async function submit(e) {
    e.preventDefault();
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name}`);
      navigate(user.role === "ADMIN" ? "/admin" : user.role === "ORGANIZER" ? "/organizer" : "/dashboard");
    } catch (error) {
      toast.error(apiError(error));
    }
  }

  return (
    <main className="auth-page page grid min-h-[calc(100vh-64px)] place-items-center">
      <form className="auth-card panel w-full max-w-md space-y-4 p-6" onSubmit={submit}>
        <div>
          <h1 className="text-3xl font-extrabold">Login</h1>
          <p className="mt-1 text-sm text-slate-600">Use your EventPro account to continue.</p>
        </div>
        <label><span className="label">Email</span><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label><span className="label">Password</span><input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        <button className="btn btn-primary w-full">Login</button>
        <div className="credential-box">
          <span className="credential-label">Organizer login</span>
          <strong>organizer@eventpro.local</strong>
          <span>Password: Organizer@123</span>
        </div>
        <p className="text-center text-sm text-slate-600">New here? <Link className="font-bold text-coral" to="/register">Create account</Link></p>
      </form>
    </main>
  );
}
