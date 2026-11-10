import React from "react";
import { Search, Filter, Calendar, MapPin, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EventCard from "../components/EventCard";
import { categories, labelCategory } from "../constants/categories";
import { api, apiError } from "../services/api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "", location: "", freeOnly: "" });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ size: "100", sort: "dateTime,asc" });
    Object.entries(filters).forEach(([key, value]) => value !== "" && params.set(key, value));
    try {
      const { data } = await api.get(`/events?${params}`);
      setEvents(data.content || []);
    } catch (error) {
      alert(apiError(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="page">
      <div className="mb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-ink mb-2">Browse Events</h1>
            <p className="text-lg text-slate-600">Discover amazing experiences near you</p>
          </div>
          <div className="flex gap-3">
            <button 
              className="btn btn-secondary md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filters
            </button>
            <button className="btn btn-primary" onClick={load}>
              <Search size={18} />
              Search Events
            </button>
          </div>
        </div>
      </div>

      <div className={`panel p-6 mb-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
          <Filter size={18} className="text-blue-600" />
          Filter Events
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-600" />
              Search events
            </label>
            <input 
              className="input" 
              placeholder="Event name or keyword..." 
              value={filters.search} 
              onChange={(e) => setFilters({ ...filters, search: e.target.value })} 
            />
          </div>
          <div>
            <label className="label flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Category
            </label>
            <select 
              className="input" 
              value={filters.category} 
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{labelCategory(category)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              Location
            </label>
            <input 
              className="input" 
              placeholder="City or venue..." 
              value={filters.location} 
              onChange={(e) => setFilters({ ...filters, location: e.target.value })} 
            />
          </div>
          <div>
            <label className="label flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              Price
            </label>
            <select 
              className="input" 
              value={filters.freeOnly} 
              onChange={(e) => setFilters({ ...filters, freeOnly: e.target.value })}
            >
              <option value="">All events</option>
              <option value="true">Free only</option>
              <option value="false">Paid only</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Search className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-2">No events found</h3>
              <p className="text-slate-600">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
