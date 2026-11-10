import React from "react";
import { ArrowRight, CalendarCheck, CreditCard, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EventCard from "../components/EventCard";
import { categories, labelCategory } from "../constants/categories";
import { api, apiError } from "../services/api";
import heroEventScene from "../assets/hero-event-scene.svg";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ size: "100", sort: "dateTime,asc" });
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    try {
      const { data } = await api.get(`/events?${params}`);
      setEvents(data.content || []);
    } catch (error) {
      toast.error(apiError(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <section className="hero-section relative min-h-[620px] overflow-hidden bg-ink text-white">
        <img
          src={heroEventScene}
          className="hero-image absolute inset-0 h-full w-full object-cover"
          alt="Live event audience"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div className="hero-copy max-w-3xl">
            <p className="hero-kicker mb-4 text-sm font-bold uppercase tracking-[0.2em] text-coral">Plan. Publish. Sell. Attend.</p>
            <h1 className="hero-title text-5xl font-extrabold leading-tight sm:text-7xl">EventPro</h1>
            <p className="hero-subtitle mt-5 max-w-2xl text-lg leading-8 text-slate-100">
              A full-stack event platform for organizers, attendees, and admins with approvals, live seat inventory, payments, and dashboards.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="hero-cta hero-cta-primary btn" to="/events">Explore events <ArrowRight size={18} /></Link>
              <Link className="hero-cta hero-cta-secondary btn" to="/register">Create account</Link>
            </div>
          </div>
          <div className="hero-glass-card hidden lg:block">
            <span className="hero-card-badge">Live Experience</span>
            <div className="mt-6 space-y-4">
              <div className="hero-card-row"><span>Seat inventory</span><strong>Real time</strong></div>
              <div className="hero-card-row"><span>Checkout flow</span><strong>Secure</strong></div>
              <div className="hero-card-row"><span>Organizer tools</span><strong>Premium</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="page">
        <div className="grid gap-4 md:grid-cols-3">
          {[["Moderated events", ShieldCheck], ["Seat-safe booking", CalendarCheck], ["Payment simulation", CreditCard]].map(([label, Icon]) => (
            <div key={label} className="panel flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-coral/10 text-coral"><Icon /></span>
              <div>
                <h2 className="font-bold">{label}</h2>
                <p className="text-sm text-slate-600">Built into the working flow.</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">All Events</h2>
            <p className="mt-1 text-slate-600">Search every live event by name and category.</p>
          </div>
          <Link className="btn btn-secondary" to="/events">See all</Link>
        </div>
        <div className="panel mt-6 grid gap-3 p-4 md:grid-cols-[1fr_240px_auto]">
          <input className="input" placeholder="Search event name" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <select className="input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category} value={category}>{labelCategory(category)}</option>)}
          </select>
          <button className="btn btn-primary" onClick={load}>Apply filters</button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {loading ? <p className="text-slate-600">Loading events...</p> : events.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      </section>
    </>
  );
}
