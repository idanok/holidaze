import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [venueManager, setVenueManager] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(name, email, password, venueManager);
      navigate('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
          List your venue or discover your next perfect stay.
        </p>
        <div className="mt-12 flex flex-col gap-3 w-full max-w-xs text-left">
          {[
            { icon: '✓', text: 'Book unique venues across Norway' },
            { icon: '✓', text: 'List and manage your own venues' },
            { icon: '✓', text: 'View and manage all your bookings' },
            { icon: '✓', text: 'Free to register – no hidden fees' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span className="text-[#E8614A] font-bold">{item.icon}</span>
              <span className="text-white/60 text-sm">{item.text}</span>
            </div>
          ))}
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
              Create account
            </h1>
            <p className="text-sm text-[#8A8F9A] mb-8">Join Holidaze today</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#2D3340] mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="my_username"
                  required
                  className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] focus:bg-white transition-colors placeholder:text-[#C4BFB8]"
                />
                <p className="text-xs text-[#8A8F9A] mt-1">No punctuation except underscore (_)</p>
              </div>

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
                <p className="text-xs text-[#8A8F9A] mt-1">Must be a stud.noroff.no email</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2D3340] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border-2 border-[#E8E4DE] rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] focus:bg-white transition-colors placeholder:text-[#C4BFB8]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2D3340] mb-3">
                  Account type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVenueManager(false)}
                    className={`py-3.5 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
                      !venueManager
                        ? 'border-[#E8614A] bg-[#E8614A]/5 text-[#E8614A]'
                        : 'border-[#E8E4DE] text-[#8A8F9A] hover:border-[#2D3340] hover:text-[#2D3340]'
                    }`}
                  >
                    🧳 Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setVenueManager(true)}
                    className={`py-3.5 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
                      venueManager
                        ? 'border-[#E8614A] bg-[#E8614A]/5 text-[#E8614A]'
                        : 'border-[#E8E4DE] text-[#8A8F9A] hover:border-[#2D3340] hover:text-[#2D3340]'
                    }`}
                  >
                    🏠 Venue Manager
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E8614A] text-white font-semibold py-4 rounded-xl hover:bg-[#d4553f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2 text-sm tracking-wide"
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#E8E4DE]" />
              <span className="text-xs text-[#8A8F9A]">or</span>
              <div className="flex-1 h-px bg-[#E8E4DE]" />
            </div>

            <p className="text-center text-sm text-[#8A8F9A]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#E8614A] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}