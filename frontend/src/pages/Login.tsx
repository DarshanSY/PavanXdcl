import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, user } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (!isLogin && !name) {
      setErrorMsg('Please enter your name.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMsg(res.message);
          setTimeout(() => {
            navigate('/dashboard');
          }, 600);
        } else {
          setErrorMsg(res.message);
        }
      } else {
        const res = await register(name, email, password);
        if (res.success) {
          setSuccessMsg(res.message);
          setTimeout(() => {
            navigate('/dashboard');
          }, 600);
        } else {
          setErrorMsg(res.message);
        }
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('student@pavanxdcl.in');
    setPassword('password123');
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await login('student@pavanxdcl.in', 'password123');
      if (res.success) {
        setSuccessMsg("Demo Login Successful!");
        setTimeout(() => {
          navigate('/dashboard');
        }, 600);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 min-h-screen pt-28 pb-16 px-6 md:px-12 flex flex-col justify-center items-center font-mono">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-home-accent/5 rounded-full filter blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="w-full max-w-md glass-card glass-card-glow-orange border border-white/[0.08] rounded-3xl p-8 relative overflow-hidden shadow-2xl"
      >
        {/* Toggle tabs */}
        <div className="flex border-b border-white/10 mb-8 relative">
          <button
            onClick={() => { setIsLogin(true); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 pb-4 text-sm font-semibold tracking-wider transition-colors ${
              isLogin ? 'text-home-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => { setIsLogin(false); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 pb-4 text-sm font-semibold tracking-wider transition-colors ${
              !isLogin ? 'text-home-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            CREATE ACCOUNT
          </button>
          {/* Active border underline */}
          <motion.div
            className="absolute bottom-0 h-[2px] bg-home-accent"
            animate={{ x: isLogin ? '0%' : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ width: '50%' }}
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="font-syne font-extrabold text-2xl text-white">
            {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
          </h2>
          <p className="text-[10px] text-gray-500 mt-1">
            {isLogin ? '// Access your learning progress' : '// Create account to save your sheets'}
          </p>
        </div>

        {/* Error or Success feedback alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name Field (Sign Up Only) */}
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest pl-1">Name</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Pavan Prakash"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-home-accent/50 focus:bg-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest pl-1">Email</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="student@pavanxdcl.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-home-accent/50 focus:bg-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-home-accent/50 focus:bg-white/10 rounded-xl py-3.5 pl-11 pr-12 text-sm text-white placeholder-gray-600 outline-none transition-all"
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
            className="mt-4 w-full bg-home-accent hover:bg-home-accentDark text-white font-syne font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] shadow-lg transition-all disabled:opacity-50 disabled:transform-none disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Sign Up'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Trigger */}
        {isLogin && (
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <span className="text-[10px] text-gray-500">// Testing and Evaluation</span>
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="mt-2 w-full bg-white/5 border border-white/10 hover:border-home-accent/30 hover:bg-white/10 text-gray-300 hover:text-white py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              ⚡ Quick Demo Login (student@pavanxdcl.in)
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
