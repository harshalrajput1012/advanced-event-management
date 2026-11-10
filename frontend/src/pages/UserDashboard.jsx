import React from "react";
import toast from "react-hot-toast";
import StatusBadge from "../components/StatusBadge";
import { useAsync } from "../hooks/useAsync";
import { api, apiError } from "../services/api";
import { formatPrice } from "../utils/currency";

export default function UserDashboard() {
  const { data, loading, setData } = useAsync(() => api.get("/bookings/mine?size=20&sort=createdAt,desc").then((r) => r.data), []);

  async function cancel(id) {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      const refreshed = await api.get("/bookings/mine?size=20&sort=createdAt,desc").then((r) => r.data);
      setData(refreshed);
    } catch (error) {
      toast.error(apiError(error));
    }
  }

  return (
    <main className="page">
      <h1 className="text-3xl font-extrabold">My Bookings</h1>
      <div className="panel mt-6 overflow-hidden">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Event</th><th>Date</th><th>Tickets</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {loading ? <tr><td className="p-4" colSpan="6">Loading...</td></tr> : data?.content?.map((b) => (
              <tr className="border-t border-slate-100" key={b.id}>
                <td className="p-4 font-semibold">{b.event.title}</td>
                <td>{new Date(b.event.dateTime).toLocaleString()}</td>
                <td>{b.ticketCount}</td>
                <td>{formatPrice(b.totalPrice)}</td>
                <td><StatusBadge value={b.status} /></td>
                <td className="p-4 text-right"><button className="btn btn-secondary" onClick={() => cancel(b.id)} disabled={b.status === "CANCELLED"}>Cancel</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
