import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfileBookings, getProfileVenues, updateAvatar, deleteVenue } from '../api/profiles';
import type { Venue, Booking } from '../types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';

interface BookingWithVenue extends Booking {
  venue?: Venue;
}

interface VenueWithBookings extends Venue {
  bookings?: Booking[];
}

export default function Profile() {
  const { user, token, isVenueManager, logout, login } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<BookingWithVenue[]>([]);
  const [venues, setVenues] = useState<VenueWithBookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'venues'>('bookings');

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, token]);

  async function fetchData() {
    try {
      setLoading(true);
      if (isVenueManager) {
        const data = await getProfileVenues(user!.name, token!);
        setVenues(data);
      } else {
        const data = await getProfileBookings(user!.name, token!);
        setBookings(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !token || !avatarUrl.trim()) return;
    setAvatarError('');
    setAvatarSuccess(false);
    setAvatarLoading(true);
    try {
      const updated = await updateAvatar(user.name, token, avatarUrl);
      login(token, { ...user, avatar: updated.avatar });
      setAvatarSuccess(true);
      setAvatarUrl('');
    } catch (err: unknown) {
      setAvatarError(err instanceof Error ? err.message : 'Failed to update avatar');
    } finally {
      setAvatarLoading(false);
    }
  }

  async function handleDeleteVenue(id: string) {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this venue?')) return;
    try {
      await deleteVenue(id, token);
      setVenues((prev) => prev.filter((v) => v.id !== id));
    } catch {
      setDeleteError('Failed to delete venue. Please try again.');
    }
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (!user) return null;

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.dateTo) >= new Date()
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0]">

      {/* Page header */}
      <div className="bg-[#1B2B40] px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Avatar */}
          <div className="relative">
            {user.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#E8614A] flex items-center justify-center text-white font-serif text-4xl font-bold border-4 border-white/20">
                {user.name[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="text-center sm:text-left">
            <h1 className="font-serif text-3xl font-semibold text-white mb-1">
              {user.name}
            </h1>
            <p className="text-white/50 text-sm mb-3">{user.email}</p>
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
              isVenueManager
                ? 'bg-[#E8614A]/20 text-[#E8614A]'
                : 'bg-white/10 text-white/70'
            }`}>
              {isVenueManager ? '🏠 Venue Manager' : '🧳 Customer'}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="sm:ml-auto border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Sidebar */}
          <div className="flex flex-col gap-6">

            {/* Update avatar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E4DE]">
              <h2 className="font-serif text-xl font-semibold text-[#1B2B40] mb-4">
                Update Avatar
              </h2>
              <form onSubmit={handleAvatarUpdate} className="flex flex-col gap-3">
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border-2 border-[#E8614A]/40 rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] transition-colors placeholder:text-[#C4BFB8]"
                />
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-xl"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                {avatarError && (
                  <p className="text-red-500 text-xs">{avatarError}</p>
                )}
                {avatarSuccess && (
                  <p className="text-green-600 text-xs">Avatar updated successfully!</p>
                )}
                <button
                  type="submit"
                  disabled={avatarLoading}
                  className="w-full bg-[#E8614A] text-white font-semibold py-3 rounded-xl hover:bg-[#d4553f] transition-colors disabled:opacity-60 text-sm"
                >
                  {avatarLoading ? 'Saving…' : 'Save Avatar'}
                </button>
              </form>
            </div>

            {/* Manager – create venue button */}
            {isVenueManager && (
              <Link
                to="/manager/venues/create"
                className="bg-[#1B2B40] text-white font-semibold py-4 px-6 rounded-2xl hover:bg-[#2d4460] transition-colors text-sm text-center shadow-sm"
              >
                + Create New Venue
              </Link>
            )}
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">

            {/* ── CUSTOMER – bookings ── */}
            {!isVenueManager && (
              <>
                <h2 className="font-serif text-2xl font-semibold text-[#1B2B40] mb-6">
                  Upcoming Bookings
                </h2>

                {loading && (
                  <div className="flex flex-col gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl p-5 animate-pulse flex gap-4">
                        <div className="w-16 h-16 bg-[#E8E4DE] rounded-xl flex-shrink-0" />
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="h-4 bg-[#E8E4DE] rounded w-3/4" />
                          <div className="h-3 bg-[#E8E4DE] rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && upcomingBookings.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E4DE]">
                    <p className="text-4xl mb-3">📅</p>
                    <h3 className="font-serif text-xl text-[#1B2B40] mb-2">No upcoming bookings</h3>
                    <p className="text-sm text-[#8A8F9A] mb-6">You haven't booked any venues yet.</p>
                    <Link
                      to="/venues"
                      className="bg-[#E8614A] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#d4553f] transition-colors"
                    >
                      Browse Venues
                    </Link>
                  </div>
                )}

                {!loading && upcomingBookings.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DE] flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={booking.venue?.media?.[0]?.url || FALLBACK_IMAGE}
                            alt={booking.venue?.name || 'Venue'}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/venues/${booking.venue?.id}`}
                            className="font-semibold text-[#1B2B40] hover:text-[#E8614A] transition-colors text-sm block truncate"
                          >
                            {booking.venue?.name || 'Unknown venue'}
                          </Link>
                          <p className="text-xs text-[#8A8F9A] mt-1">
                            {new Date(booking.dateFrom).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {' – '}
                            {new Date(booking.dateTo).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-[#8A8F9A]">👥 {booking.guests} guests</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="bg-[#7A9E8E]/15 text-[#7A9E8E] text-xs font-bold px-3 py-1.5 rounded-full">
                            Confirmed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── MANAGER – venues ── */}
            {isVenueManager && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl font-semibold text-[#1B2B40]">
                    My Venues
                  </h2>
                  {/* Tabs */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('venues')}
                      className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${
                        activeTab === 'venues'
                          ? 'bg-[#1B2B40] text-white'
                          : 'bg-white text-[#8A8F9A] border border-[#E8E4DE]'
                      }`}
                    >
                      Venues
                    </button>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${
                        activeTab === 'bookings'
                          ? 'bg-[#1B2B40] text-white'
                          : 'bg-white text-[#8A8F9A] border border-[#E8E4DE]'
                      }`}
                    >
                      Bookings
                    </button>
                  </div>
                </div>

                {deleteError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                    {deleteError}
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-24" />
                    ))}
                  </div>
                )}

                {/* Venues tab */}
                {!loading && activeTab === 'venues' && (
                  <>
                    {venues.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E4DE]">
                        <p className="text-4xl mb-3">🏠</p>
                        <h3 className="font-serif text-xl text-[#1B2B40] mb-2">No venues yet</h3>
                        <p className="text-sm text-[#8A8F9A] mb-6">Create your first venue to start accepting bookings.</p>
                        <Link
                          to="/manager/venues/create"
                          className="bg-[#E8614A] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#d4553f] transition-colors"
                        >
                          Create Venue
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {venues.map((venue) => (
                          <div key={venue.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DE] flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                              <img
                                src={venue.media?.[0]?.url || FALLBACK_IMAGE}
                                alt={venue.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/venues/${venue.id}`}
                                className="font-semibold text-[#1B2B40] hover:text-[#E8614A] transition-colors text-sm block truncate"
                              >
                                {venue.name}
                              </Link>
                              <p className="text-xs text-[#8A8F9A] mt-1">
                                NOK {venue.price.toLocaleString()} / night · Max {venue.maxGuests} guests
                              </p>
                              <p className="text-xs text-[#8A8F9A]">
                                📅 {venue.bookings?.length || 0} bookings
                              </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Link
                                to={`/manager/venues/${venue.id}/edit`}
                                className="text-xs font-semibold bg-[#1B2B40] text-white px-3 py-2 rounded-lg hover:bg-[#2d4460] transition-colors"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteVenue(venue.id)}
                                className="text-xs font-semibold border border-red-200 text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Bookings tab */}
                {!loading && activeTab === 'bookings' && (
                  <>
                    {venues.every((v) => !v.bookings?.length) ? (
                      <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E4DE]">
                        <p className="text-4xl mb-3">📅</p>
                        <h3 className="font-serif text-xl text-[#1B2B40] mb-2">No bookings yet</h3>
                        <p className="text-sm text-[#8A8F9A]">Bookings on your venues will appear here.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6">
                        {venues.filter((v) => v.bookings && v.bookings.length > 0).map((venue) => (
                          <div key={venue.id}>
                            <h3 className="font-semibold text-[#1B2B40] text-sm mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#E8614A]" />
                              {venue.name}
                            </h3>
                            <div className="flex flex-col gap-3">
                              {venue.bookings?.map((booking) => (
                                <div key={booking.id} className="bg-white rounded-xl p-4 border border-[#E8E4DE] flex items-center justify-between gap-4">
                                  <div>
                                    <p className="text-sm font-semibold text-[#1B2B40]">
                                      👥 {booking.guests} guests
                                    </p>
                                    <p className="text-xs text-[#8A8F9A] mt-0.5">
                                      {new Date(booking.dateFrom).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                      {' – '}
                                      {new Date(booking.dateTo).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                  </div>
                                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                                    new Date(booking.dateTo) >= new Date()
                                      ? 'bg-[#7A9E8E]/15 text-[#7A9E8E]'
                                      : 'bg-[#E8E4DE] text-[#8A8F9A]'
                                  }`}>
                                    {new Date(booking.dateTo) >= new Date() ? 'Upcoming' : 'Past'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}