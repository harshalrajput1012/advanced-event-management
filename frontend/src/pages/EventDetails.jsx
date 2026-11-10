import React from "react";
import { Calendar, MapPin, Ticket, Clock, Users, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";
import { labelCategory } from "../constants/categories";
import { formatPrice } from "../utils/currency";
import { eventImage, fallbackEventImage } from "../utils/eventImages";
import { api } from "../services/api";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: event, loading, error } = useAsync(() => api.get(`/events/${id}`).then((r) => r.data), [id]);
  if (loading) return <main className="page">Loading event...</main>;
  if (error) return <main className="page text-red-600">{error}</main>;
  function handleImageError(error) {
    error.currentTarget.onerror = null;
    error.currentTarget.src = fallbackEventImage(event);
  }

  return (
    <main className="page animate-fade-in">
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-2xl">
        <div className="absolute inset-0 bg-black/20" />
        <img 
          className="h-96 w-full object-cover opacity-40" 
          src={eventImage(event)} 
          onError={handleImageError} 
          alt={event.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-bold text-white border border-white/30">
              {labelCategory(event.category)}
            </span>
            <div className="flex items-center gap-1 text-yellow-300">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-semibold">4.8</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{event.title}</h1>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{new Date(event.dateTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{new Date(event.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <div className="panel p-8 animate-slide-up">
            <h2 className="text-2xl font-bold mb-4 text-ink">About this event</h2>
            <p className="leading-relaxed text-slate-600 text-lg">{event.description}</p>
            
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink mb-1">Capacity</h3>
                  <p className="text-slate-600">{event.availableSeats} of {event.capacity} seats available</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Ticket className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink mb-1">Ticket Price</h3>
                  <p className="text-slate-600">{formatPrice(event.price)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <aside className="h-fit">
          <div className="panel p-6 sticky top-24 shadow-card animate-slide-up">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-ink mb-2">Event Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span>{new Date(event.dateTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Ticket className="h-5 w-5 text-blue-500" />
                    <span>{event.availableSeats} seats left</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm font-semibold text-slate-500 mb-3">Organizer</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    {event.organizer?.name?.charAt(0) || 'E'}
                  </div>
                  <div>
                    <p className="font-bold text-ink">{event.organizer.name}</p>
                    <p className="text-sm text-slate-600">{event.organizer.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-500">Price</span>
                  <span className="text-3xl font-bold text-ink">{formatPrice(event.price)}</span>
                </div>
                <Link 
                  className="btn btn-primary w-full text-base py-3 shadow-lg" 
                  to={user ? `/events/${event.id}/book` : "/login"}
                >
                  {user ? 'Register for Event' : 'Login to Register'}
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
