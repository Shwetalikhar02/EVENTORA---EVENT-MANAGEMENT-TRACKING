import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaTicketAlt, FaLock, FaEnvelope, FaKey } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOTP(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError('Account not verified. A new OTP has been sent to your email.');
            } else {
                setError(err.message || err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-12 bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-indigo-100">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                    <FaTicketAlt />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">Welcome Back</h2>
                <p className="text-gray-500 text-xs">Sign in to manage your bookings and events</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl mb-6 text-center font-medium border border-red-100 shadow-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {!showOTP ? (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <FaEnvelope className="text-indigo-500" /> Email Address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="name@domain.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <FaLock className="text-indigo-500" /> Password
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <FaKey className="text-indigo-500" /> 6-Digit OTP Code
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="123456"
                            className="w-full px-4 py-3.5 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 transition shadow-sm font-black tracking-widest text-center text-xl text-indigo-900 bg-indigo-50/30"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                        />
                    </div>
                )}
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-500/25 text-sm cursor-pointer disabled:opacity-50"
                >
                    {loading ? 'Processing...' : (showOTP ? 'Verify OTP & Log In' : 'Sign In')}
                </button>
            </form>

            <p className="text-center mt-8 text-xs text-gray-500">
                Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
