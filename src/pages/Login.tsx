import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      login(user.accessToken, user);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel – navy */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B2B40] flex-col items-center justify-center px-16 text-center">
        <Link to="/" className="font-serif text-5xl font-bold text-white mb-6">
          Holida<span className="text-[#E8614A]">ze</span>
        </Link>
        <p className="text-white/50 text-lg font-light max-w-xs leading-relaxed">
          Discover unique venues for your next unforgettable escape.
        </p>
        <div className="mt-12 flex flex-col gap-4 w-full max-w-xs">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-5 py-4">
            <span className="text-2xl">🏔️</span>
            <div className="text-left">
              <div className="text-white text-sm font-semibold">Mountain Retreats</div>
              <div className="text-white/40 text-xs">Cosy cabins with fjord views</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-5 py-4">
            <span className="text-2xl">🌊</span>
            <div className="text-left">
              <div className="text-white text-sm font-semibold">Coastal Stays</div>
              <div className="text-white/40 text-xs">Wake up to the sound of waves</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-5 py-4">
            <span className="text-2xl">🏙️</span>
            <div className="text-left">
              <div className="text-white text-sm font-semibold">City Lofts</div>
              <div className="text-white/40 text-xs">Design apartments in the heart of the city</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="w-full lg:w-1/2 bg-[#FAF6F0] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="font-serif text-4xl font-bold text-[#1B2B40]">
              Holida<span className="text-[#E8614A]">ze</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-10">
            <h1 className="font-serif text-3xl font-semibold text-[#1B2B40] mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-[#8A8F9A] mb-8">Sign in to your account</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#2D3340] mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@stud.noroff.no"
                  required
                  className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] focus:bg-white transition-colors placeholder:text-[#C4BFB8]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2D3340] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] focus:bg-white transition-colors placeholder:text-[#C4BFB8]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E8614A] text-white font-semibold py-4 rounded-xl hover:bg-[#d4553f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2 text-sm tracking-wide"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#E8E4DE]" />
              <span className="text-xs text-[#8A8F9A]">or</span>
              <div className="flex-1 h-px bg-[#E8E4DE]" />
            </div>

            <p className="text-center text-sm text-[#8A8F9A]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#E8614A] font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}