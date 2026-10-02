import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle, FaUserCheck, FaCalendarCheck } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-lg font-semibold text-indigo-600">Loading user dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto my-4">
            {/* Header User Banner */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-indigo-500/15 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center text-3xl font-black uppercase tracking-wider shrink-0 border border-white/30 shadow-inner">
                    {user?.name.charAt(0)}
                </div>
                <div className="flex flex-col items-center sm:items-start">
                    <h1 className="text-2xl sm:text-3xl font-black mb-1">Welcome back, {user?.name}!</h1>
                    <p className="text-indigo-100 text-xs flex items-center justify-center sm:justify-start gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> Personal Dashboard • Student & Participant
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2.5">
                    <FaCalendarCheck className="text-indigo-600" /> My Booking Requests
                </h2>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                    {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
                </span>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-indigo-50">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                        <FaTicketAlt />
                    </div>
                    <p className="text-lg text-gray-700 mb-6 font-bold">You haven't booked any events yet.</p>
                    <Link 
                        to="/" 
                        className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-indigo-500/25 text-xs"
                    >
                        Browse Available Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-indigo-50 flex flex-col">
                            <div className="p-6 flex-grow">
                                {booking.eventId ? (
                                    <>
                                        <div className="flex justify-between items-start mb-3 gap-2">
                                            <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-1">{booking.eventId.title}</h3>
                                            <div className="flex flex-col gap-1 items-end shrink-0">
                                                <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${
                                                    booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                    'bg-amber-100 text-amber-700 border border-amber-200'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                                {booking.status !== 'cancelled' && (
                                                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${
                                                        booking.paymentStatus === 'paid' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                    }`}>
                                                        {booking.paymentStatus.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mb-4 space-y-1.5 font-medium">
                                            <p><strong className="text-gray-700">Date:</strong> {new Date(booking.eventId.date).toLocaleDateString()}</p>
                                            <p><strong className="text-gray-700">Amount:</strong> {booking.amount === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `₹${booking.amount}`}</p>
                                            <p><strong className="text-gray-700">Requested:</strong> {new Date(booking.bookedAt).toLocaleDateString()}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-red-500 text-xs italic">Event details unavailable</p>
                                )}
                            </div>
                            <div className="p-3.5 bg-slate-50 flex justify-between items-center shrink-0 border-t border-gray-100">
                                {booking.eventId && booking.status !== 'cancelled' ? (
                                    <>
                                        <Link to={`/events/${booking.eventId._id}`} className="text-indigo-600 font-bold text-xs hover:underline">View Event</Link>
                                        <button
                                            onClick={() => cancelBooking(booking._id)}
                                            className="text-red-500 font-bold text-xs hover:text-red-700 transition flex items-center gap-1"
                                        >
                                            <FaTimesCircle /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full text-center text-xs text-gray-400 font-medium">Booking Cancelled</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
