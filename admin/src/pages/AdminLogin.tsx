import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Mail, AlertTriangle, Eye, EyeOff, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import GlowingOrbs from '../components/GlowingOrbs';

const AdminLogin: React.FC = () => {
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await adminLogin(email.trim(), password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid admin credentials. Please make sure email is admin@pavanxdcl.in and password matches.');
      }
    } catch (err) {
      setError('Connection to backend failed. Ensure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = async () => {
    setEmail('admin@pavanxdcl.in');
    setPassword('PavanAdmin@2026');
    setError('');
    setLoading(true);

    try {
      const success = await adminLogin('admin@pavanxdcl.in', 'PavanAdmin@2026');
      if (success) {
        navigate('/');
      } else {
        setError('Invalid admin credentials.');
      }
    } catch (err) {
      setError('Connection to backend failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 min-h-screen pt-28 pb-16 px-6 md:px-12 flex flex-col justify-center items-center font-mono">
      {/* Background drifting glow elements */}
      <GlowingOrbs />

      {/* Center glowing element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-card glass-card-glow-purple border border-white/[0.08] rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="font-syne font-extrabold text-2xl text-white select-none">
            Admin Portal
          </h2>
          <p className="text-[10px] text-gray-500 mt-1 select-none">
            // Authenticate to access PavanxDCL control panel
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center font-mono flex items-center justify-center gap-2">
            <AlertTriangle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest pl-1">Admin Email</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="admin@pavanxdcl.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-purple/50 focus:bg-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all font-mono"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest pl-1">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-purple/50 focus:bg-white/10 rounded-xl py-3.5 pl-11 pr-12 text-sm text-white placeholder-gray-600 outline-none transition-all font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-purple to-cyan text-white font-syne font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(139,92,246,0.4)] shadow-lg transition-all disabled:opacity-50 disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Decrypting & Authenticating...</span>
              </>
            ) : (
              <>
                <span>Decrypt & Access Control</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
          <span className="text-[10px] text-gray-500">// Testing & Quick Evaluation</span>
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            disabled={loading}
            className="mt-2 w-full bg-purple/10 border border-purple/30 hover:bg-purple/20 hover:border-purple/50 text-purple-200 py-3 rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles size={14} className="text-cyan" />
            <span>⚡ Quick Demo Admin Login</span>
          </button>
        </div>

        <div className="mt-6 text-center text-[10px] text-muted border-t border-white/[0.04] pt-4 font-mono select-none">
          SECURE CONNECTION ENCRYPTED &bull; 2026
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

