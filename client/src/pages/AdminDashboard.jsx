import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMoneyBillWave, FaUsers, FaHourglassHalf, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my') // Admin gets all bookings
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Cancel this user\'s booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-lg font-semibold text-indigo-600">Loading admin panel...</div>;

    return (
        <div className="max-w-7xl mx-auto my-4">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-indigo-500/20 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black mb-1">Admin Dashboard</h1>
                    <p className="text-indigo-100 text-xs">Create events, manage seating capacity, and verify pending payment requests.</p>
                </div>
                <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="w-full md:w-auto bg-white text-indigo-900 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 transition shadow-lg text-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                    <FaPlus /> {showEventForm ? 'Cancel Creation' : 'Create New Event'}
                </button>
            </div>

            {/* Admin Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-black text-emerald-600">
                            ₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0)}
                        </h3>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">
                        <FaMoneyBillWave />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Paid Attendees</p>
                        <h3 className="text-3xl font-black text-indigo-600">
                            {new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size}
                        </h3>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
                        <FaUsers />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Pending Requests</p>
                        <h3 className="text-3xl font-black text-amber-600">
                            {bookings.filter(b => b.status === 'pending').length}
                        </h3>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-xl">
                        <FaHourglassHalf />
                    </div>
                </div>
            </div>

            {showEventForm && (
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-100 mb-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-900">Create New Event</h2>
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                        <input required type="text" placeholder="Event Title" className="border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input required type="text" placeholder="Category (e.g. Tech, Music, Sports)" className="border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        <input required type="date" className="border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        <input required type="text" placeholder="Location" className="border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        <input required type="number" placeholder="Total Seats" className="border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                        <input required type="number" placeholder="Ticket Price (0 for free)" className="border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />

                        <div className="md:col-span-2">
                            <input type="text" placeholder="Image URL (Public Image Link)" className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                        </div>

                        <textarea required placeholder="Event Description" className="border border-gray-200 px-4 py-3 rounded-xl md:col-span-2 h-28 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <button type="submit" className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-md transition text-xs">Publish Event</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Events Section */}
                <div className="flex flex-col">
                    <h2 className="text-xl font-extrabold mb-5 text-gray-900 flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">{events.length}</span>
                        All Active Events
                    </h2>
                    <div className="bg-white rounded-2xl shadow-md border border-indigo-50 overflow-hidden">
                        <ul className="divide-y divide-gray-100 max-h-[580px] overflow-y-auto">
                            {events.length === 0 ? <li className="p-6 text-gray-400 text-center text-xs font-medium">No events created yet.</li> :
                                events.map(event => (
                                    <li key={event._id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition">
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1 leading-tight text-sm">{event.title}</h4>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium">
                                                <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                                                <span className="text-indigo-600 font-bold">💺 {event.availableSeats}/{event.totalSeats} seats left</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteEvent(event._id)} className="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer">
                                            <FaTrash className="text-[10px]" /> Delete
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>

                {/* Bookings Section */}
                <div className="flex flex-col">
                    <h2 className="text-xl font-extrabold mb-5 text-gray-900 flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{bookings.length}</span>
                        Incoming Booking Requests
                    </h2>
                    <div className="bg-white rounded-2xl shadow-md border border-indigo-50 overflow-hidden">
                        <ul className="divide-y divide-gray-100 max-h-[580px] overflow-y-auto">
                            {bookings.length === 0 ? <li className="p-6 text-gray-400 text-center text-xs font-medium">No booking requests yet.</li> :
                                bookings.map(booking => (
                                    <li key={booking._id} className={`p-5 hover:bg-slate-50 transition border-l-4 ${booking.status === 'pending' ? 'border-l-amber-400' : booking.status === 'confirmed' ? 'border-l-emerald-400' : 'border-l-red-400'}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{booking.eventId?.title || 'Deleted Event'}</h4>
                                            <div className="flex flex-col gap-1 items-end shrink-0 ml-2">
                                                <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{booking.status}</span>
                                                {booking.status !== 'cancelled' && <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>{booking.paymentStatus.replace('_', ' ')}</span>}
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-50 rounded-xl p-3 mb-3 border border-gray-100 text-xs space-y-1">
                                            <p className="text-gray-700"><span className="font-bold text-gray-400 uppercase text-[10px] w-14 inline-block">User:</span> <strong className="text-gray-900">{booking.userId?.name}</strong> ({booking.userId?.email})</p>
                                            <p className="text-gray-700"><span className="font-bold text-gray-400 uppercase text-[10px] w-14 inline-block">Amount:</span> <strong className={booking.amount === 0 ? 'text-emerald-600' : 'text-gray-900'}>{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</strong></p>
                                            <p className="text-gray-700"><span className="font-bold text-gray-400 uppercase text-[10px] w-14 inline-block">Date:</span> {new Date(booking.bookedAt).toLocaleString()}</p>
                                        </div>

                                        {booking.status === 'pending' && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-[11px] font-bold py-2 px-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-1 cursor-pointer">
                                                    <FaCheck /> Approve Paid
                                                </button>
                                                <button onClick={() => handleConfirmBooking(booking._id, 'not_paid')} className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 text-[11px] font-bold py-2 px-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-1 cursor-pointer">
                                                    <FaCheck /> Approve Free/Unpaid
                                                </button>
                                                <button onClick={() => handleCancelBooking(booking._id)} className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 text-[11px] font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer">
                                                    <FaTimes /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
