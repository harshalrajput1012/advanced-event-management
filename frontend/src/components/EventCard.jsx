import React from "react";
import { Calendar, MapPin, Ticket, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { labelCategory } from "../constants/categories";
import { formatPrice } from "../utils/currency";
import { eventImage, fallbackEventImage } from "../utils/eventImages";

export default function EventCard({ event }) {
  const date = new Date(event.dateTime);
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  function handleImageError(error) {
    error.currentTarget.onerror = null;
    error.currentTarget.src = fallbackEventImage(event);
  }
  
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg shadow-slate-200/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-300/40 animate-slide-up">
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <img 
          src={eventImage(event)}
          onError={handleImageError}
          alt={event.title} 
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4">
          <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-blue-600 shadow-lg">
            {labelCategory(event.category)}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-semibold text-white">4.8</span>
          </div>
        </div>
      </div>
      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="line-clamp-2 text-xl font-bold text-ink leading-tight group-hover:text-blue-600 transition-colors">
              {event.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600 leading-relaxed">
              {event.description}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(event.price)}
            </span>
            <span className="text-xs text-slate-500 mt-1">per ticket</span>
          </div>
        </div>
        
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-slate-700">{formattedDate}</p>
              <p className="text-xs text-slate-500">{formattedTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <p className="font-medium text-slate-700 truncate">{event.location}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Ticket className="h-4 w-4 text-orange-600" />
              </div>
              <p className="font-medium text-slate-700">
                {event.availableSeats} seats left
              </p>
            </div>
            <div className="text-xs text-slate-500">
              {event.capacity - event.availableSeats} booked
            </div>
          </div>
        </div>
        
        <Link 
          className="btn btn-primary w-full justify-center shadow-lg hover:shadow-xl" 
          to={`/events/${event.id}`}
        >
          View details
        </Link>
      </div>
    </article>
  );
}
