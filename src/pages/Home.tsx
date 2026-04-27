import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getVenues } from '../api/venues';
import VenueCard from '../components/ui/VenueCard';
import type { Venue } from '../types';

export default function Home() {
  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await getVenues();
        setFeatured(data.slice(0, 4));
      } catch {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/venues?q=${query}`);
    } else {
      navigate('/venues');
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0]">

      {/* ── HERO ── */}
      <div className="bg-[#1B2B40] min-h-[560px] flex items-center px-6 lg:px-16 py-20 relative overflow-hidden">

        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#E8614A]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#7A9E8E]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl">
          {/* Eyebrow */}
          <p className="text-[#F2C784] text-xs font-semibold tracking-widest uppercase mb-5">
            ✦ Find your perfect stay
          </p>

          {/* Headline */}
          <h1 className="font-serif text-6xl lg:text-7xl font-light text-white leading-[1.05] mb-6">
            Your next<br />
            <span className="text-[#E8614A]">escape</span><br />
            awaits
          </h1>

          {/* Subtext */}
          <p className="text-white/50 text-base mb-10 max-w-md leading-relaxed">
            Discover unique venues handpicked for unforgettable experiences — from coastal retreats to mountain hideaways.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex bg-white rounded-xl overflow-hidden shadow-2xl max-w-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, venues…"
              className="flex-1 px-5 py-4 text-sm text-[#2D3340] outline-none bg-transparent placeholder:text-[#C4BFB8]"
            />
            <button
              type="submit"
              className="bg-[#E8614A] px-7 text-white text-sm font-semibold hover:bg-[#d4553f] transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="bg-white border-b border-[#E8E4DE]">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="font-serif text-3xl font-bold text-[#1B2B40]">500+</p>
            <p className="text-xs text-[#8A8F9A] mt-1">Venues available</p>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-[#1B2B40]">50+</p>
            <p className="text-xs text-[#8A8F9A] mt-1">Destinations</p>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-[#1B2B40]">4.8 ★</p>
            <p className="text-xs text-[#8A8F9A] mt-1">Average rating</p>
          </div>
        </div>
      </div>

      {/* ── FEATURED VENUES ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-[#8A8F9A] tracking-widest uppercase mb-2">
              Handpicked for you
            </p>
            <h2 className="font-serif text-4xl font-light text-[#1B2B40]">
              Popular <span className="text-[#E8614A]">Venues</span>
            </h2>
          </div>
          <Link
            to="/venues"
            className="text-sm font-semibold text-[#E8614A] hover:underline hidden sm:block"
          >
            View all →
          </Link>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-52 bg-[#E8E4DE]" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-3 bg-[#E8E4DE] rounded w-1/2" />
                  <div className="h-4 bg-[#E8E4DE] rounded w-3/4" />
                  <div className="h-3 bg-[#E8E4DE] rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Venue cards */}
        {!loading && featured.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Link
            to="/venues"
            className="text-sm font-semibold text-[#E8614A] hover:underline"
          >
            View all venues →
          </Link>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="bg-white border-t border-[#E8E4DE] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#8A8F9A] tracking-widest uppercase mb-2">
              Simple and easy
            </p>
            <h2 className="font-serif text-4xl font-light text-[#1B2B40]">
              How it <span className="text-[#E8614A]">works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#1B2B40] flex items-center justify-center text-2xl mb-5">
                🔍
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1B2B40] mb-2">Search</h3>
              <p className="text-sm text-[#8A8F9A] leading-relaxed">
                Browse hundreds of unique venues across Norway and beyond.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#E8614A] flex items-center justify-center text-2xl mb-5">
                📅
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1B2B40] mb-2">Book</h3>
              <p className="text-sm text-[#8A8F9A] leading-relaxed">
                Choose your dates, select your guests and reserve instantly.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#7A9E8E] flex items-center justify-center text-2xl mb-5">
                🏖️
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1B2B40] mb-2">Enjoy</h3>
              <p className="text-sm text-[#8A8F9A] leading-relaxed">
                Arrive and enjoy your stay at a handpicked venue.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div className="bg-[#1B2B40] py-16 px-6 text-center">
        <h2 className="font-serif text-4xl font-light text-white mb-4">
          Ready to find your <span className="text-[#E8614A]">escape?</span>
        </h2>
        <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
          Join thousands of travellers who have found their perfect stay on Holidaze.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/venues"
            className="bg-[#E8614A] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#d4553f] transition-colors text-sm"
          >
            Browse Venues
          </Link>
          <Link
            to="/register"
            className="border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:border-white/40 transition-colors text-sm"
          >
            Create Account
          </Link>
        </div>
      </div>

    </div>
  );
}