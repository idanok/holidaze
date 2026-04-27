import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getVenueById } from '../api/venues';
import { createBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import type { Venue } from '../types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, isVenueManager, token } = useAuth();
  const navigate = useNavigate();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking form state
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchVenue();
  }, [id]);

  async function fetchVenue() {
    try {
      setLoading(true);
      const data = await getVenueById(id!);
      setVenue(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load venue');
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !id) return;
    setBookingError('');
    setBookingLoading(true);

    try {
      await createBooking(token, id, dateFrom, dateTo, guests);
      setBookingSuccess(true);
      setDateFrom('');
      setDateTo('');
      setGuests(1);
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  }

  // Get booked dates for calendar display
  const bookedDates = venue?.bookings?.map((b) => ({
    from: new Date(b.dateFrom),
    to: new Date(b.dateTo),
  })) || [];

  // Calculate total nights and price
  const nights = dateFrom && dateTo
    ? Math.ceil((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const total = nights > 0 && venue ? nights * venue.price : 0;

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0]">
        <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
          <div className="h-96 bg-[#E8E4DE] rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="h-8 bg-[#E8E4DE] rounded w-3/4" />
              <div className="h-4 bg-[#E8E4DE] rounded w-1/2" />
              <div className="h-32 bg-[#E8E4DE] rounded" />
            </div>
            <div className="h-80 bg-[#E8E4DE] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !venue) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <h2 className="font-serif text-2xl text-[#1B2B40] mb-2">Venue not found</h2>
          <p className="text-[#8A8F9A] text-sm mb-6">{error}</p>
          <Link to="/venues" className="bg-[#E8614A] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#d4553f] transition-colors">
            Back to Venues
          </Link>
        </div>
      </div>
    );
  }

  const image = venue.media?.[0]?.url || FALLBACK_IMAGE;
  const city = venue.location?.city || '';
  const country = venue.location?.country || '';

  return (
    <div className="min-h-screen bg-[#FAF6F0]">

      {/* Hero image */}
      <div className="w-full h-80 lg:h-[480px] overflow-hidden relative">
        <img
          src={image}
          alt={venue.media?.[0]?.alt || venue.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-[#1B2B40] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white transition-colors flex items-center gap-2 shadow-sm"
        >
          ← Back
        </button>

        {/* Rating badge */}
        {venue.rating > 0 && (
          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-[#1B2B40] px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1 shadow-sm">
            <span className="text-[#F2C784]">★</span>
            {venue.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left – venue info */}
          <div className="lg:col-span-2">

            {/* Location + title */}
            <p className="text-sm text-[#8A8F9A] mb-2">
              📍 {[city, country].filter(Boolean).join(', ') || 'Location not specified'}
            </p>
            <h1 className="font-serif text-4xl font-light text-[#1B2B40] mb-6 leading-tight">
              {venue.name}
            </h1>

            {/* Amenities */}
            <div className="flex gap-3 flex-wrap mb-8">
              {venue.meta?.wifi && (
                <span className="bg-white border border-[#E8E4DE] text-sm text-[#2D3340] px-4 py-2 rounded-full">🌐 WiFi</span>
              )}
              {venue.meta?.parking && (
                <span className="bg-white border border-[#E8E4DE] text-sm text-[#2D3340] px-4 py-2 rounded-full">🅿️ Parking</span>
              )}
              {venue.meta?.breakfast && (
                <span className="bg-white border border-[#E8E4DE] text-sm text-[#2D3340] px-4 py-2 rounded-full">🍳 Breakfast</span>
              )}
              {venue.meta?.pets && (
                <span className="bg-white border border-[#E8E4DE] text-sm text-[#2D3340] px-4 py-2 rounded-full">🐾 Pets allowed</span>
              )}
              <span className="bg-white border border-[#E8E4DE] text-sm text-[#2D3340] px-4 py-2 rounded-full">
                👥 Max {venue.maxGuests} guests
              </span>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="font-serif text-2xl font-semibold text-[#1B2B40] mb-3">About this venue</h2>
              <p className="text-[#2D3340] leading-relaxed text-sm">{venue.description}</p>
            </div>

            {/* Location details */}
            {(venue.location?.address || venue.location?.city) && (
              <div className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-[#1B2B40] mb-3">Location</h2>
                <div className="bg-white rounded-2xl p-6 border border-[#E8E4DE] text-sm text-[#2D3340] flex flex-col gap-1">
                  {venue.location.address && <p>{venue.location.address}</p>}
                  {venue.location.city && <p>{venue.location.city}{venue.location.zip ? `, ${venue.location.zip}` : ''}</p>}
                  {venue.location.country && <p>{venue.location.country}</p>}
                </div>
              </div>
            )}

            {/* Booked dates */}
            {bookedDates.length > 0 && (
              <div className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-[#1B2B40] mb-3">Booked dates</h2>
                <div className="bg-white rounded-2xl p-6 border border-[#E8E4DE] flex flex-col gap-2">
                  {bookedDates.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="w-2 h-2 rounded-full bg-[#E8614A] flex-shrink-0" />
                      <span className="text-[#2D3340]">
                        {d.from.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' – '}
                        {d.to.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner */}
            {venue.owner && (
              <div className="mb-10">
                <h2 className="font-serif text-2xl font-semibold text-[#1B2B40] mb-3">Hosted by</h2>
                <div className="bg-white rounded-2xl p-6 border border-[#E8E4DE] flex items-center gap-4">
                  {venue.owner.avatar?.url ? (
                    <img
                      src={venue.owner.avatar.url}
                      alt={venue.owner.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#1B2B40] flex items-center justify-center text-white font-bold text-lg">
                      {venue.owner.name[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[#1B2B40]">{venue.owner.name}</p>
                    <p className="text-sm text-[#8A8F9A]">{venue.owner.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right – booking widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-8 sticky top-24">

              {/* Price */}
              <div className="mb-6">
                <span className="font-serif text-4xl font-bold text-[#1B2B40]">
                  NOK {venue.price.toLocaleString()}
                </span>
                <span className="text-sm text-[#8A8F9A] ml-1">/ night</span>
              </div>

              {/* Manager – no booking widget */}
              {isVenueManager ? (
                <div className="text-center py-4">
                  <p className="text-sm text-[#8A8F9A] mb-4">You are logged in as a venue manager.</p>
                  <Link
                    to="/profile"
                    className="text-[#E8614A] text-sm font-semibold hover:underline"
                  >
                    Go to Dashboard →
                  </Link>
                </div>

              ) : !isLoggedIn ? (
                // Not logged in
                <div className="text-center py-4">
                  <p className="text-sm text-[#8A8F9A] mb-4">Log in to book this venue</p>
                  <Link
                    to="/login"
                    className="w-full block bg-[#E8614A] text-white font-semibold py-3.5 rounded-xl hover:bg-[#d4553f] transition-colors text-sm text-center"
                  >
                    Log In to Book
                  </Link>
                </div>

              ) : bookingSuccess ? (
                // Success state
                <div className="text-center py-6">
                  <p className="text-4xl mb-3">🎉</p>
                  <h3 className="font-serif text-xl font-semibold text-[#1B2B40] mb-2">Booking confirmed!</h3>
                  <p className="text-sm text-[#8A8F9A] mb-6">Your stay has been booked successfully.</p>
                  <Link
                    to="/profile"
                    className="block w-full bg-[#1B2B40] text-white font-semibold py-3.5 rounded-xl hover:bg-[#2d4460] transition-colors text-sm text-center"
                  >
                    View My Bookings
                  </Link>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="mt-3 text-sm text-[#8A8F9A] hover:text-[#E8614A] transition-colors"
                  >
                    Book again
                  </button>
                </div>

              ) : (
                // Booking form
                <form onSubmit={handleBooking} className="flex flex-col gap-4">
                  {bookingError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
                      {bookingError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1B2B40] mb-1 uppercase tracking-wide">Check-in</label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full px-3 py-2.5 border-2 border-[#E8614A]/40 rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1B2B40] mb-1 uppercase tracking-wide">Check-out</label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        min={dateFrom || new Date().toISOString().split('T')[0]}
                        required
                        className="w-full px-3 py-2.5 border-2 border-[#E8614A]/40 rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B2B40] mb-1 uppercase tracking-wide">Guests</label>
                    <input
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      min={1}
                      max={venue.maxGuests}
                      required
                      className="w-full px-3 py-2.5 border-2 border-[#E8614A]/40 rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] transition-colors"
                    />
                    <p className="text-xs text-[#8A8F9A] mt-1">Max {venue.maxGuests} guests</p>
                  </div>

                  {/* Price summary */}
                  {nights > 0 && (
                    <div className="bg-[#FAF6F0] rounded-xl p-4 text-sm flex flex-col gap-2">
                      <div className="flex justify-between text-[#2D3340]">
                        <span>NOK {venue.price.toLocaleString()} × {nights} nights</span>
                        <span>NOK {total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-[#1B2B40] pt-2 border-t border-[#E8E4DE]">
                        <span>Total</span>
                        <span>NOK {total.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-[#E8614A] text-white font-semibold py-4 rounded-xl hover:bg-[#d4553f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                  >
                    {bookingLoading ? 'Booking…' : 'Reserve'}
                  </button>

                  <p className="text-center text-xs text-[#8A8F9A]">You won't be charged yet</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}