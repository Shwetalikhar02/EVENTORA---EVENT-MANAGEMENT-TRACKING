import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-xl sticky top-0 z-40 backdrop-blur-md border-b border-white/20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center py-3.5 gap-4">
                    <Link to="/" className="text-white text-2xl font-black flex items-center gap-2.5 tracking-tight group">
                        <div className="bg-white/20 p-2 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-inner">
                            <FaTicketAlt className="text-yellow-300 text-xl transform -rotate-12 group-hover:rotate-0 transition-all" />
                        </div>
                        <span className="drop-shadow-sm font-extrabold">Eventora</span>
                    </Link>
                    
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <Link 
                            to="/" 
                            className="text-white/90 hover:text-white font-medium hover:bg-white/15 px-3.5 py-2 rounded-xl transition-all cursor-pointer text-sm"
                        >
                            Events
                        </Link>
                        {user ? (
                            <>
                                <Link 
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                                    className="text-white/90 hover:text-white font-medium hover:bg-white/15 px-3.5 py-2 rounded-xl transition-all text-sm flex items-center gap-1.5"
                                >
                                    <FaUserCircle className="text-yellow-300" /> Dashboard
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2 rounded-xl transition text-sm flex items-center gap-1.5 shadow-sm"
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="text-white font-semibold hover:bg-white/15 px-4 py-2 rounded-xl transition text-sm"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-white text-indigo-700 hover:bg-indigo-50 px-5 py-2 rounded-xl font-bold transition text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
