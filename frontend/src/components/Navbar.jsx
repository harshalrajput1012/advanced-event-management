import React from "react";
import { CalendarDays, LayoutDashboard, LogOut, ShieldCheck, Sparkles, UserRoundPlus } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate("/");
  }

  return (
    <header className="site-navbar sticky top-0 z-40">
      <nav className="navbar-shell mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="brand-link flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="brand-mark grid h-9 w-9 place-items-center rounded-lg bg-ink text-white"><Sparkles size={18} /></span>
          <span>EventPro</span>
        </Link>
        <div className="navbar-links hidden items-center gap-2 md:flex">
          <NavLink className="nav-link btn btn-secondary" to="/events"><CalendarDays size={17} />Events</NavLink>
          {user && <NavLink className="nav-link btn btn-secondary" to="/dashboard"><LayoutDashboard size={17} />Dashboard</NavLink>}
          {(user?.role === "ORGANIZER" || user?.role === "ADMIN") && <NavLink className="nav-link btn btn-secondary" to="/organizer">Organizer</NavLink>}
          {user?.role === "ADMIN" && <NavLink className="nav-link btn btn-secondary" to="/admin"><ShieldCheck size={17} />Admin</NavLink>}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm font-semibold text-slate-600 sm:block">{user.name}</span>
              <button className="nav-action nav-action-primary btn btn-primary" onClick={signOut}><LogOut size={17} />Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-action nav-action-secondary btn btn-secondary" to="/login">Login</Link>
              <Link className="nav-action nav-action-secondary btn btn-secondary" to="/admin/login">Admin</Link>
              <Link className="nav-action nav-action-primary btn btn-primary" to="/register"><UserRoundPlus size={17} />Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
