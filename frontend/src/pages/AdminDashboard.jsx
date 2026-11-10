import React from "react";
import { CheckCircle, UserPlus, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatusBadge from "../components/StatusBadge";
import { api, apiError } from "../services/api";
import { formatPrice } from "../utils/currency";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [organizer, setOrganizer] = useState({ name: "", email: "", password: "" });

  async function load() {
    const [userPage, pendingEvents, approvedEvents, rejectedEvents] = await Promise.all([
      api.get("/admin/users?size=50&sort=id,desc").then((r) => r.data),
      api.get("/events?status=PENDING&size=50&sort=createdAt,desc").then((r) => r.data),
      api.get("/events?status=APPROVED&size=50&sort=createdAt,desc").then((r) => r.data),
      api.get("/events?status=REJECTED&size=50&sort=createdAt,desc").then((r) => r.data)
    ]);
    setUsers(userPage.content || []);
    setEvents([
      ...(pendingEvents.content || []),
      ...(approvedEvents.content || []),
      ...(rejectedEvents.content || [])
    ]);
  }

  useEffect(() => {
    load().catch((e) => toast.error(apiError(e)));
  }, []);

  async function userStatus(id, status) {
    await api.patch(`/admin/users/${id}/status?status=${status}`);
    toast.success("User updated");
    load();
  }

  async function moderate(id, status) {
    await api.patch(`/events/${id}/moderate?status=${status}`);
    toast.success(`Event ${status.toLowerCase()}`);
    load();
  }

  async function createOrganizer(e) {
    e.preventDefault();
    try {
      await api.post("/admin/organizers", organizer);
      toast.success("Organizer created");
      setOrganizer({ name: "", email: "", password: "" });
      await load();
    } catch (error) {
      toast.error(apiError(error));
    }
  }

  return (
    <main className="page space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        <p className="mt-1 text-slate-600">Create organizers, moderate events, and manage platform users.</p>
      </div>
      <form className="panel grid gap-4 p-6 md:grid-cols-[1fr_1fr_1fr_auto]" onSubmit={createOrganizer}>
        <h2 className="text-xl font-extrabold md:col-span-4">Create Organizer</h2>
        <input className="input" placeholder="Organizer name" value={organizer.name} onChange={(e) => setOrganizer({ ...organizer, name: e.target.value })} required />
        <input className="input" type="email" placeholder="Organizer email" value={organizer.email} onChange={(e) => setOrganizer({ ...organizer, email: e.target.value })} required />
        <input className="input" type="password" minLength="8" placeholder="Temporary password" value={organizer.password} onChange={(e) => setOrganizer({ ...organizer, password: e.target.value })} required />
        <button className="btn btn-primary"><UserPlus size={17} />Create</button>
      </form>
      <section className="panel overflow-hidden">
        <div className="p-5">
          <h2 className="text-xl font-extrabold">Organizer Events</h2>
          <p className="mt-1 text-sm text-slate-600">Only approved events are visible in Browse Events. Pending and rejected events stay hidden from users.</p>
        </div>
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Title</th><th>Description</th><th>Organizer</th><th>Date</th><th>Price</th><th>Status</th><th></th></tr></thead>
          <tbody>{events.map((event) => <tr className="border-t border-slate-100 align-top" key={event.id}><td className="p-4 font-semibold">{event.title}</td><td className="max-w-xs py-4 pr-4 text-slate-600">{event.description}</td><td className="py-4 pr-4">{event.organizer.name}</td><td className="py-4 pr-4">{new Date(event.dateTime).toLocaleString()}</td><td className="py-4 pr-4">{formatPrice(event.price)}</td><td className="py-4 pr-4"><StatusBadge value={event.status} /></td><td className="flex gap-2 p-3"><button className="btn btn-secondary" disabled={event.status === "APPROVED"} onClick={() => moderate(event.id, "APPROVED")}><CheckCircle size={17} />Approve</button><button className="btn btn-secondary" disabled={event.status === "REJECTED"} onClick={() => moderate(event.id, "REJECTED")}><XCircle size={17} />Deny</button></td></tr>)}</tbody>
        </table>
        {events.length === 0 && <p className="border-t border-slate-100 p-5 text-sm text-slate-600">No organizer events have been created yet.</p>}
      </section>
      <section className="panel overflow-hidden">
        <h2 className="p-5 text-xl font-extrabold">Users</h2>
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>{users.map((user) => <tr className="border-t border-slate-100" key={user.id}><td className="p-4 font-semibold">{user.name}</td><td>{user.email}</td><td>{user.role}</td><td><StatusBadge value={user.status} /></td><td className="p-3 text-right"><button className="btn btn-secondary" onClick={() => userStatus(user.id, user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE")}>{user.status === "ACTIVE" ? "Block" : "Unblock"}</button></td></tr>)}</tbody>
        </table>
      </section>
    </main>
  );
}
