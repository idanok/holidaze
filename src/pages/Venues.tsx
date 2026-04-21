import { useEffect, useState } from 'react';
import VenueCard from '../components/ui/VenueCard';
import { getVenues, searchVenues } from '../api/venues';
import type { Venue } from '../types';

export default function Venues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  async function fetchVenues() {
    try {
      setLoading(true);
      const data = await getVenues();
      setVenues(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load venues');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!query.trim()) {
      fetchVenues();
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setSearching(true);
        const data = await searchVenues(query);
        setVenues(data);
      } catch {
        setVenues([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="min-h-screen bg-[#FAF6F0]">

      {/* Page header */}
      <div className="bg-[#1B2B40] px-6 py-16 text-center">
        <h1 className="font-serif text-5xl font-light text-white mb-4">
          Explore <span className="text-[#E8614A]">Venues</span>
        </h1>
        <p className="text-white/50 mb-8 text-sm">
          Find the perfect place for your next getaway
        </p>

        {/* Search */}
        <div className="flex max-w-xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations, venues…"
            className="flex-1 px-5 py-4 text-sm text-[#2D3340] outline-none bg-transparent placeholder:text-[#C4BFB8]"
          />
          <button className="bg-[#E8614A] px-6 text-white text-sm font-semibold hover:bg-[#d4553f] transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Loading */}
        {(loading || searching) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-52 bg-[#E8E4DE]" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-3 bg-[#E8E4DE] rounded w-1/2" />
                  <div className="h-4 bg-[#E8E4DE] rounded w-3/4" />
                  <div className="h-3 bg-[#E8E4DE] rounded w-full" />
                  <div className="h-4 bg-[#E8E4DE] rounded w-1/3 mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-[#E8614A] text-lg mb-4">{error}</p>
            <button
              onClick={fetchVenues}
              className="bg-[#E8614A] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#d4553f] transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !searching && !error && venues.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="font-serif text-2xl text-[#1B2B40] mb-2">No venues found</h2>
            <p className="text-[#8A8F9A] text-sm">Try a different search term</p>
          </div>
        )}

        {/* Venues grid */}
        {!loading && !searching && venues.length > 0 && (
          <>
            <p className="text-sm text-[#8A8F9A] mb-6">
              {query ? `${venues.length} results for "${query}"` : `${venues.length} venues available`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}