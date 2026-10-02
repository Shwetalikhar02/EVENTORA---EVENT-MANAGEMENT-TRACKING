import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaKey } from 'react-icons/fa';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                await register(name, email, password);
                setShowOTP(true);
                setError('');
            } else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-indigo-100">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-pink-600 text-white rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-purple-500/30">
                    <FaUserPlus />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">Create an Account</h2>
                <p className="text-gray-500 text-xs">Join Eventora for fast ticket reservations</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl mb-6 text-center font-medium border border-red-100 shadow-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!showOTP ? (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <FaUser className="text-purple-500" /> Full Name
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition shadow-sm text-sm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <FaEnvelope className="text-purple-500" /> Email Address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="name@domain.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition shadow-sm text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <FaLock className="text-purple-500" /> Password
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition shadow-sm text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <div>
                        <div className="text-xs text-emerald-800 bg-emerald-50 p-3.5 mb-4 rounded-xl border border-emerald-200 font-medium">
                            An OTP has been sent to your email address. Enter code below to complete activation.
                        </div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <FaKey className="text-purple-500" /> 6-Digit OTP Code
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="123456"
                            className="w-full px-4 py-3.5 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 transition shadow-sm font-black tracking-widest text-center text-xl text-purple-900 bg-purple-50/30"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-purple-500/25 text-sm cursor-pointer mt-2"
                >
                    {loading ? 'Processing...' : (showOTP ? 'Verify OTP & Activate' : 'Sign Up Now')}
                </button>
            </form>

            {!showOTP && (
                <p className="text-center mt-6 text-xs text-gray-500">
                    Already have an account? <Link to="/login" className="text-purple-600 font-bold hover:underline">Sign in</Link>
                </p>
            )}
        </div>
    );
};

export default Register;
