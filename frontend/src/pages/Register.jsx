import React from "react";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../services/api";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function submit(e) {
    e.preventDefault();
    try {
      const user = await register({ ...form, role: "USER" });
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(apiError(error));
    }
  }

  return (
    <main className="auth-page page grid min-h-[calc(100vh-64px)] place-items-center">
      <form className="auth-card panel w-full max-w-md space-y-4 p-6" onSubmit={submit}>
        <div>
          <h1 className="text-3xl font-extrabold">Create Account</h1>
          <p className="mt-1 text-sm text-slate-600">Create a user account to register for events.</p>
        </div>
        <label><span className="label">Name</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label><span className="label">Email</span><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label><span className="label">Password</span><input className="input" type="password" minLength="8" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        <button className="btn btn-primary w-full">Register</button>
        <p className="text-center text-sm text-slate-600">Already registered? <Link className="font-bold text-coral" to="/login">Login</Link></p>
      </form>
    </main>
  );
}
