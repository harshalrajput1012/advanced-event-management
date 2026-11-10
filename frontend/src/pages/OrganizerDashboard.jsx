import React from "react";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { categories, labelCategory } from "../constants/categories";
import { api, apiError } from "../services/api";
import { formatPrice } from "../utils/currency";

const empty = { title: "", description: "", category: "MUSIC", location: "", dateTime: "", capacity: 100, price: 0, imageUrl: "" };

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ confirmedBookings: 0, totalRevenue: 0 });
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  async function load() {
    const [eventPage, bookingPage, dashboard] = await Promise.all([
      api.get("/events/organizer/mine?size=20&sort=createdAt,desc").then((r) => r.data),
      api.get("/bookings/organizer?size=20&sort=createdAt,desc").then((r) => r.data),
      api.get("/bookings/organizer/dashboard").then((r) => r.data)
    ]);
    setEvents(eventPage.content || []);
    setBookings(bookingPage.content || []);
    setStats(dashboard);
  }

  useEffect(() => {
    load().catch((e) => toast.error(apiError(e)));
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      const payload = { ...form, capacity: Number(form.capacity), price: Number(form.price) };
      if (editingId) {
        const { data } = await api.put(`/events/${editingId}`, payload);
        toast.success(data.status === "APPROVED" ? "Event updated and published" : "Event updated and sent for admin approval");
      } else {
        const { data } = await api.post("/events", payload);
        toast.success(data.status === "APPROVED" ? "Event created and published" : "Event created and sent for admin approval");
      }
      resetForm();
      await load();
    } catch (error) {
      toast.error(apiError(error));
    }
  }

  async function upload(file) {
    const body = new FormData();
    body.append("file", file);
    const { data } = await api.post("/events/upload", body);
    setForm({ ...form, imageUrl: data.url });
    toast.success("Image uploaded");
  }

  function edit(event) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      category: event.category,
      location: event.location,
      dateTime: event.dateTime?.slice(0, 16),
      capacity: event.capacity,
      price: event.price,
      imageUrl: event.imageUrl || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(empty);
  }

  const confirmedBookings = bookings.filter((booking) => booking.status === "CONFIRMED");
  const uniqueAttendees = new Set(confirmedBookings.map((booking) => booking.user?.email || booking.user?.name || booking.id)).size;
  const ticketsSold = confirmedBookings.reduce((sum, booking) => sum + Number(booking.ticketCount || 0), 0);
  const visibleRevenue = confirmedBookings.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0);

  async function remove(id) {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted");
      await load();
    } catch (error) {
      toast.error(apiError(error));
    }
  }

  return (
    <main className="page space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">Organizer Dashboard</h1>
        <p className="mt-1 text-slate-600">Create events, track approvals, revenue, and attendees.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Confirmed bookings" value={stats.confirmedBookings} />
        <StatCard label="Total revenue" value={formatPrice(stats.totalRevenue, { showFree: false })} />
      </div>
      <form className="panel grid gap-4 p-6 lg:grid-cols-2" onSubmit={submit}>
        <div className="flex items-center justify-between lg:col-span-2">
          <h2 className="text-xl font-extrabold">{editingId ? "Edit Event" : "Create Event"}</h2>
          {editingId && <button type="button" className="btn btn-secondary" onClick={resetForm}><X size={17} />Cancel edit</button>}
        </div>
        <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {categories.map((category) => <option key={category} value={category}>{labelCategory(category)}</option>)}
        </select>
        <input className="input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        <input className="input" type="datetime-local" value={form.dateTime} onChange={(e) => setForm({ ...form, dateTime: e.target.value })} required />
        <input className="input" type="number" min="1" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        <input className="input" type="number" min="0" step="0.01" placeholder="Price (INR)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="input lg:col-span-2" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <textarea className="input h-28 py-3 lg:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <label className="btn btn-secondary cursor-pointer"><Upload size={17} />Upload image<input className="hidden" type="file" accept="image/*" onChange={(e) => upload(e.target.files[0])} /></label>
        <button className="btn btn-primary">{editingId ? <Pencil size={17} /> : <Plus size={17} />}{editingId ? "Update event" : "Create event"}</button>
      </form>
      <section className="panel overflow-hidden">
        <h2 className="p-5 text-xl font-extrabold">My Events</h2>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Title</th><th>Category</th><th>Date</th><th>Price</th><th>Seats</th><th>Status</th><th></th></tr></thead>
          <tbody>{events.map((e) => <tr className="border-t border-slate-100" key={e.id}><td className="p-4 font-semibold">{e.title}</td><td>{labelCategory(e.category)}</td><td>{new Date(e.dateTime).toLocaleString()}</td><td>{formatPrice(e.price)}</td><td>{e.availableSeats}/{e.capacity}</td><td><StatusBadge value={e.status} /></td><td className="flex justify-end gap-2 p-3"><button className="btn btn-secondary" onClick={() => edit(e)}><Pencil size={16} />Edit</button><button className="btn btn-secondary" onClick={() => remove(e.id)}><Trash2 size={16} />Delete</button></td></tr>)}</tbody>
        </table>
      </section>
      <section className="panel overflow-hidden">
        <div className="p-5">
          <h2 className="text-xl font-extrabold">Attendees</h2>
          <p className="mt-1 text-sm text-slate-600">Users appear here after they register and complete the payment success flow for one of your events.</p>
          <div className="attendee-summary-grid mt-5">
            <div className="attendee-summary-card">
              <span>Registered users</span>
              <strong>{uniqueAttendees}</strong>
            </div>
            <div className="attendee-summary-card">
              <span>Confirmed bookings</span>
              <strong>{stats.confirmedBookings}</strong>
            </div>
            <div className="attendee-summary-card">
              <span>Tickets sold</span>
              <strong>{ticketsSold}</strong>
            </div>
            <div className="attendee-summary-card">
              <span>Revenue shown</span>
              <strong>{formatPrice(visibleRevenue, { showFree: false })}</strong>
            </div>
          </div>
        </div>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Registered User</th><th>Event</th><th>Tickets</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>{bookings.map((b) => <tr className="border-t border-slate-100" key={b.id}><td className="p-4 font-semibold">{b.user.name}</td><td>{b.event.title}</td><td>{b.ticketCount}</td><td>{formatPrice(b.totalPrice)}</td><td><StatusBadge value={b.status} /></td></tr>)}</tbody>
        </table>
        {bookings.length === 0 && <p className="border-t border-slate-100 p-5 text-sm text-slate-600">No attendee bookings yet. When users complete a successful payment for events owned by this organizer, their registration details will appear here.</p>}
      </section>
    </main>
  );
}
