import React from "react";
import { CalendarDays, Clock, CreditCard, Mail, MapPin, Phone, ShieldCheck, Star, Ticket, UserRound, Users, WalletCards } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { labelCategory } from "../constants/categories";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";
import { api, apiError } from "../services/api";
import { formatPrice } from "../utils/currency";
import { eventImage, fallbackEventImage } from "../utils/eventImages";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState(1);
  const [fail, setFail] = useState(false);
  const [details, setDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: ""
  });
  const { data: event, loading, error } = useAsync(() => api.get(`/events/${id}`).then((r) => r.data), [id]);
  const selectedTickets = Math.max(1, Number(tickets) || 1);
  const total = Number(event?.price || 0) * selectedTickets;

  function handleImageError(error) {
    error.currentTarget.onerror = null;
    error.currentTarget.src = fallbackEventImage(event);
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const booking = await api.post("/bookings", { eventId: Number(id), ticketCount: selectedTickets }).then((r) => r.data);
      const payment = await api.post("/payments/simulate", { bookingId: booking.id, forceFailure: fail }).then((r) => r.data);
      toast[payment.status === "SUCCESS" ? "success" : "error"](payment.status === "SUCCESS" ? "Booking confirmed" : "Payment failed, seats released");
      navigate("/dashboard");
    } catch (error) {
      toast.error(apiError(error));
    }
  }

  if (loading) return <main className="page">Loading checkout...</main>;
  if (error) return <main className="page text-red-600">{error}</main>;
  if (!event) return <main className="page">Event not found.</main>;
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-blue-50">
      <form className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8" onSubmit={submit}>
        <section className="space-y-8">
          <article className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/30 animate-slide-up">
            <div className="relative aspect-[16/7] min-h-80 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
              <img className="h-full w-full object-cover mix-blend-multiply" src={eventImage(event)} onError={handleImageError} alt={event.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex rounded-full bg-blue-600/90 backdrop-blur-sm px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white shadow-lg">
                    {labelCategory(event.category)}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold">4.8</span>
                  </div>
                </div>
                <h1 className="max-w-3xl text-3xl md:text-4xl font-extrabold leading-tight text-white mb-4">{event.title}</h1>
                <p className="mb-5 max-w-3xl text-sm font-medium leading-relaxed text-white/85 md:text-base">
                  {event.description || "Event details will be updated soon."}
                </p>
                <div className="flex flex-wrap gap-6 text-sm font-medium text-white/90">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={18} />
                    <span>{new Date(event.dateTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{new Date(event.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-6 p-6 sm:grid-cols-3">
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-5 border border-blue-200/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Price</p>
                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Ticket className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-blue-900">{formatPrice(event.price)}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-5 border border-green-200/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-green-700">Available</p>
                  <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-green-900">{event.availableSeats}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-5 border border-purple-200/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-purple-700">Organizer</p>
                  <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                    <UserRound className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-lg font-extrabold text-purple-900 truncate">{event.organizer?.name || "EventPro"}</p>
              </div>
            </div>
          </article>

          <section className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-slate-200/30 animate-slide-up">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Ticket className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Ticket booking</p>
                </div>
                <h2 className="text-2xl font-extrabold text-ink">Choose your tickets</h2>
              </div>
              <span className="rounded-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-bold text-white shadow-lg">
                {event.availableSeats} seats left
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-[1fr_1.3fr]">
              <label>
                <span className="label flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-blue-600" />
                  Number of tickets
                </span>
                <div className="relative">
                  <input 
                    className="input h-14 rounded-2xl text-lg font-semibold" 
                    type="number" 
                    min="1" 
                    max={event.availableSeats} 
                    value={tickets} 
                    onChange={(e) => setTickets(e.target.value)} 
                    required 
                  />
                </div>
              </label>
              <fieldset>
                <legend className="label flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  Payment simulation
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className={`flex h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${!fail ? "border-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"}`}>
                    <input className="h-5 w-5 accent-blue-600" type="radio" name="paymentResult" checked={!fail} onChange={() => setFail(false)} />
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={18} />
                      Success
                    </span>
                  </label>
                  <label className={`flex h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${fail ? "border-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"}`}>
                    <input className="h-5 w-5 accent-blue-600" type="radio" name="paymentResult" checked={fail} onChange={() => setFail(true)} />
                    <span className="flex items-center gap-2">
                      <CreditCard size={18} />
                      Failure
                    </span>
                  </label>
                </div>
              </fieldset>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-slate-200/30 animate-slide-up">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <UserRound className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Contact information</p>
            </div>
            <h2 className="text-2xl font-extrabold text-ink mb-6">Your details</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <label>
                <span className="label flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-blue-600" />
                  Full name
                </span>
                <div className="relative">
                  <input 
                    className="input h-14 rounded-2xl text-lg" 
                    value={details.name} 
                    onChange={(e) => setDetails({ ...details, name: e.target.value })} 
                    placeholder="Your full name" 
                    required 
                  />
                </div>
              </label>
              <label>
                <span className="label flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  Email address
                </span>
                <div className="relative">
                  <input 
                    className="input h-14 rounded-2xl text-lg" 
                    type="email" 
                    value={details.email} 
                    onChange={(e) => setDetails({ ...details, email: e.target.value })} 
                    placeholder="name@example.com" 
                    required 
                  />
                </div>
              </label>
              <label className="sm:col-span-2">
                <span className="label flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  Phone number
                </span>
                <div className="relative">
                  <input 
                    className="input h-14 rounded-2xl text-lg" 
                    type="tel" 
                    value={details.phone} 
                    onChange={(e) => setDetails({ ...details, phone: e.target.value })} 
                    placeholder="Enter phone number" 
                    required 
                  />
                </div>
              </label>
            </div>
          </section>
        </section>

        <aside className="h-fit">
          <div className="panel p-6 sticky top-24 shadow-2xl shadow-slate-200/40 border border-slate-200/60 bg-white/90 backdrop-blur-sm animate-slide-up">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                    <WalletCards size={18} className="text-white" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-700">Order summary</p>
                </div>
                <h2 className="text-2xl font-extrabold text-ink">Review & pay</h2>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b border-slate-200/60">
                <p className="font-extrabold text-ink text-lg truncate">{event.title}</p>
                <p className="text-sm text-slate-600 mt-1">{labelCategory(event.category)}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {event.description || "Event details will be updated soon."}
                </p>
              </div>
              <div className="space-y-4 p-5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Ticket price</span>
                  <strong className="text-lg">{formatPrice(event.price)}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Quantity</span>
                  <strong className="text-lg">{selectedTickets}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Platform fee</span>
                  <strong className="text-lg text-green-600">{formatPrice(0, { showFree: false })}</strong>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200/60 pt-4">
                  <span className="text-xl font-bold text-ink">Total</span>
                  <span className="text-2xl font-extrabold text-blue-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            <button className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 text-base font-extrabold text-white shadow-xl shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl hover:shadow-blue-700/40 focus:outline-none focus:ring-4 focus:ring-blue-200">
              <CreditCard size={20} />
              Pay and confirm booking
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 rounded-xl p-3">
              <ShieldCheck size={16} className="text-green-600" />
              <span>Secured payment simulation</span>
            </div>
          </div>
        </aside>
      </form>
    </main>
  );
}
