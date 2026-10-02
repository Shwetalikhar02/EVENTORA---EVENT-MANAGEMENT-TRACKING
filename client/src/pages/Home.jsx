import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt, FaStar, FaFilter } from 'react-icons/fa';

const CATEGORIES = ['All', 'Tech', 'Music', 'Sports', 'Workshop', 'Business', 'Arts'];

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search, selectedCategory]);

    const fetchEvents = async () => {
        try {
            let url = `/events?search=${search}`;
            if (selectedCategory !== 'All') {
                url += `&category=${selectedCategory}`;
            }
            const { data } = await api.get(url);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryBadgeClass = (category) => {
        const cat = (category || '').toLowerCase();
        if (cat.includes('tech')) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        if (cat.includes('music')) return 'bg-purple-100 text-purple-700 border-purple-200';
        if (cat.includes('sport')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (cat.includes('work')) return 'bg-amber-100 text-amber-700 border-amber-200';
        if (cat.includes('art')) return 'bg-pink-100 text-pink-700 border-pink-200';
        return 'bg-blue-100 text-blue-700 border-blue-200';
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Animated Mesh Shader Hero Section */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 animate-gradient-mesh text-white rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-indigo-500/25">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/70 via-purple-900/40 to-transparent"></div>
                
                <div className="relative p-8 md:p-16 text-center flex flex-col items-center z-10">
                    <span className="bg-white/20 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/30 shadow-sm flex items-center gap-1.5">
                        <FaStar className="text-yellow-300" /> Welcome to Eventora
                    </span>
                    
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight drop-shadow-md">
                        Find Your Next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-pink-200">
                            Unforgettable
                        </span> Experience
                    </h1>
                    
                    <p className="text-indigo-100 text-base md:text-lg mb-10 max-w-2xl mx-auto font-normal leading-relaxed">
                        Discover top tech summits, live music festivals, and hands-on workshops in your area. Reserve tickets instantly with 2FA OTP security.
                    </p>

                    {/* Bright Search Card */}
                    <div className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl shadow-indigo-950/20 group">
                        <FaSearch className="absolute left-6 text-indigo-400 text-lg group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search events by title or keywords..."
                            className="w-full pl-14 pr-6 py-4.5 rounded-full text-base text-gray-900 bg-white/95 backdrop-blur-md border-2 border-white/80 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all placeholder-gray-400 font-medium shadow-lg"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Interactive Category Filter Chips */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                    <FaFilter className="text-indigo-500" /> Filter by Category
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer ${
                                selectedCategory === cat
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/25 scale-105'
                                    : 'bg-white/80 hover:bg-white text-gray-700 border border-indigo-50 hover:border-indigo-200'
                            }`}
                        >
                            {cat === 'All' && '✨ '}
                            {cat === 'Tech' && '💻 '}
                            {cat === 'Music' && '🎵 '}
                            {cat === 'Sports' && '⚽ '}
                            {cat === 'Workshop' && '🛠️ '}
                            {cat === 'Business' && '💼 '}
                            {cat === 'Arts' && '🎨 '}
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Vibrant Feature Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-card glass-card-hover p-7 rounded-2xl shadow-sm border border-indigo-50 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-lg shadow-indigo-500/30">
                        <FaRegClock />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Ticket Booking</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">Reserve seats instantly with streamlined OTP verification built for speed.</p>
                </div>
                
                <div className="glass-card glass-card-hover p-7 rounded-2xl shadow-sm border border-indigo-50 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-lg shadow-purple-500/30">
                        <FaTicketAlt />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Seamless Access</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">Track ticket status live and manage requests from your personal dashboard.</p>
                </div>
                
                <div className="glass-card glass-card-hover p-7 rounded-2xl shadow-sm border border-indigo-50 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-lg shadow-pink-500/30">
                        <FaShieldAlt />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">2FA Security</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">All transactions and registrations are protected by email OTP authorization.</p>
                </div>
            </div>

            {/* Events Header */}
            <div className="flex items-center justify-between mb-6 px-2 border-b border-indigo-100 pb-4">
                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-600 animate-ping"></span> Upcoming Events
                </h2>
                <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
                    {events.length} {events.length === 1 ? 'event' : 'events'} found
                </div>
            </div>

            {/* Events Grid */}
            {loading ? (
                <div className="text-center py-20 text-lg font-semibold text-indigo-600 flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading events...
                </div>
            ) : events.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center text-gray-500 border border-indigo-50 shadow-sm">
                    No events found matching your search or category filter. Try selecting "All"!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {events.map(event => (
                        <div key={event._id} className="glass-card glass-card-hover rounded-2xl overflow-hidden shadow-md border border-indigo-50 flex flex-col group">
                            <div className="h-48 bg-gradient-to-r from-indigo-100 to-purple-100 overflow-hidden relative">
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-2xl uppercase tracking-wider">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 shadow-lg">
                                    {event.ticketPrice === 0 ? (
                                        <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full border border-white">
                                            FREE
                                        </span>
                                    ) : (
                                        <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full border border-white">
                                            ₹{event.ticketPrice}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="p-6 flex-grow flex flex-col">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border w-max mb-3 ${getCategoryBadgeClass(event.category)}`}>
                                    {event.category}
                                </span>
                                
                                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                    {event.title}
                                </h3>
                                
                                <div className="flex flex-col gap-2 mb-4 text-gray-500 text-xs font-medium">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-indigo-500 shrink-0" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-pink-500 shrink-0" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-3 border-t border-gray-100">
                                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all" 
                                            style={{ width: `${Math.max(5, (event.availableSeats / event.totalSeats) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[11px] text-gray-400 font-medium mb-4 flex justify-between">
                                        <span>Available Seats</span>
                                        <span className="text-gray-700 font-bold">{event.availableSeats} of {event.totalSeats} left</span>
                                    </p>
                                    
                                    <Link 
                                        to={`/events/${event._id}`} 
                                        className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2.5 rounded-xl transition shadow-md hover:shadow-indigo-500/25 text-xs"
                                    >
                                        View Details & Book Ticket
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Section */}
            <footer className="mt-16 pt-12 pb-8 border-t border-indigo-100/60 text-center">
                <div className="flex justify-center items-center gap-2 mb-3">
                    <FaTicketAlt className="text-indigo-600 text-xl" />
                    <span className="text-lg font-black text-gray-900 tracking-tight">Eventora</span>
                </div>
                <p className="text-gray-500 text-xs mb-6 max-w-md mx-auto">
                    Seamless event discovery, ticket reservation, and 2FA OTP verification platform.
                </p>
                <div className="text-[11px] text-gray-400 font-medium">
                    &copy; {new Date().getFullYear()} Eventora. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
