import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (!showOTP) {
                await api.post('/bookings/send-otp');
                setShowOTP(true);
                setSuccessMsg('OTP sent to your email. Please verify to confirm booking.');
            } else {
                await api.post('/bookings', { eventId: event._id, otp });
                setSuccessMsg('Booking requested! Awaiting admin confirmation.');
                setShowOTP(false);
                setEvent({ ...event, availableSeats: event.availableSeats - 1 });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-lg font-semibold text-indigo-600">Loading event details...</div>;
    if (error && !event) return <div className="text-center py-20 text-lg text-red-500 font-semibold">{error || 'Event not found'}</div>;

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="max-w-4xl mx-auto my-6">
            <button 
                onClick={() => navigate('/')} 
                className="mb-6 flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-indigo-600 bg-white/80 hover:bg-white px-4 py-2 rounded-xl border border-indigo-50 shadow-sm transition"
            >
                <FaArrowLeft /> Back to Events
            </button>

            <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden border border-indigo-50">
                {event.image ? (
                    <div className="h-80 w-full overflow-hidden relative">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                            <span className="bg-indigo-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                                {event.category}
                            </span>
                            <span className="bg-white/90 backdrop-blur-md text-gray-900 text-sm font-black px-4 py-1.5 rounded-full shadow">
                                {event.ticketPrice === 0 ? <span className="text-emerald-600">FREE</span> : `₹${event.ticketPrice}`}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-64 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white text-4xl font-black uppercase tracking-widest shadow-inner">
                        {event.category}
                    </div>
                )}

                <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-8">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">{event.title}</h1>
                            <p className="text-gray-600 text-base leading-relaxed mb-6 font-normal">{event.description}</p>
                            
                            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                                <FaShieldAlt className="text-indigo-600 text-sm" /> Mandatory 2FA Email OTP Verification Required for Booking.
                            </div>
                        </div>

                        {/* Booking Sidebar Card */}
                        <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 p-6 sm:p-7 rounded-2xl border border-indigo-100 min-w-[320px] w-full md:w-auto shrink-0 shadow-md">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-indigo-100 pb-3">Booking Details</h3>

                            <div className="space-y-4 mb-8 text-xs">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shrink-0">
                                        <FaMoneyBillWave />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-400 uppercase text-[10px]">Ticket Price</p>
                                        <p className="font-bold text-gray-900 text-base">{event.ticketPrice === 0 ? <span className="text-emerald-600">Free</span> : `₹${event.ticketPrice}`}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm shrink-0">
                                        <FaChair />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-400 uppercase text-[10px]">Availability</p>
                                        <p className="font-bold text-gray-900 text-sm">
                                            <span className={event.availableSeats < 10 ? 'text-amber-600' : 'text-indigo-600'}>{event.availableSeats}</span> / {event.totalSeats} seats
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-sm shrink-0">
                                        <FaCalendarAlt />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-400 uppercase text-[10px]">Date</p>
                                        <p className="font-bold text-gray-900 text-sm">{new Date(event.date).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-sm shrink-0">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-400 uppercase text-[10px]">Location</p>
                                        <p className="font-bold text-gray-900 text-sm">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            {showOTP && (
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Enter OTP to Confirm</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="6-digit code"
                                        className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 transition shadow-sm font-black tracking-widest text-center text-lg text-indigo-900 bg-white"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleBooking}
                                disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition shadow-lg ${
                                    isSoldOut || (successMsg && !showOTP)
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white shadow-indigo-500/25 cursor-pointer'
                                }`}
                            >
                                {bookingLoading ? 'Processing...' : (showOTP ? 'Verify OTP & Confirm' : (successMsg && !showOTP ? 'Request Sent' : (isSoldOut ? 'Sold Out' : 'Book Ticket Now')))}
                            </button>
                            
                            {error && <p className="text-red-500 mt-4 text-center text-xs font-semibold bg-red-50 p-2.5 rounded-xl border border-red-100">{error}</p>}
                            {successMsg && <p className="text-emerald-700 mt-4 text-center text-xs font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">{successMsg}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
