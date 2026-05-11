import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getVenueById, updateVenue } from '../../api/venues';

export default function EditVenue() {
  const { id } = useParams<{ id: string }>();
  const { token, isVenueManager } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    maxGuests: 0,
    media: [{ url: '', alt: '' }],
    meta: { wifi: false, parking: false, breakfast: false, pets: false },
    location: { address: '', city: '', country: '' },
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    async function fetchVenue() {
      try {
        const data = await getVenueById(id!);
        setForm({
          name: data.name || '',
          description: data.description || '',
          price: data.price || 0,
          maxGuests: data.maxGuests || 0,
          media: data.media?.length ? data.media : [{ url: '', alt: '' }],
          meta: data.meta || { wifi: false, parking: false, breakfast: false, pets: false },
          location: data.location || { address: '', city: '', country: '' },
        });
      } catch {
        setError('Failed to load venue');
      } finally {
        setFetching(false);
      }
    }
    fetchVenue();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !id) return;
    setError('');
    setLoading(true);
    try {
      const venue = await updateVenue(id, form, token);
      navigate(`/venues/${venue.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update venue');
    } finally {
      setLoading(false);
    }
  }

  if (!isVenueManager) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🚫</p>
          <h2 className="font-serif text-2xl text-[#1B2B40] mb-2">Access denied</h2>
          <Link to="/" className="bg-[#E8614A] text-white px-6 py-3 rounded-xl text-sm font-semibold">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <p className="text-[#8A8F9A]">Loading venue…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0]">

      {/* Page header */}
      <div className="bg-[#1B2B40] px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
            <Link to="/profile" className="hover:text-white transition-colors">Dashboard</Link>
            <span>›</span>
            <span className="text-white/70">Edit Venue</span>
          </div>
          <h1 className="font-serif text-4xl font-light text-white">Edit venue</h1>
          <p className="text-white/50 text-sm mt-2">Update your venue details below.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Basic info */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E4DE]">
            <h2 className="font-serif text-xl font-semibold text-[#1B2B40] mb-6 pb-4 border-b border-[#E8E4DE]">
              🏠 Basic Information
            </h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-[#1B2B40] mb-2">Venue name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border-2 border-[#E8614A]/40 rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1B2B40] mb-2">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-[#E8614A]/40 rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#1B2B40] mb-2">Price per night (NOK) *</label>
                  <input
                    type="number"
                    value={form.price || ''}
                    onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                    required
                    min={1}
                    className="w-full px-4 py-3 border-2 border-[#E8614A]/40 rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1B2B40] mb-2">Max guests *</label>
                  <input
                    type="number"
                    value={form.maxGuests || ''}
                    onChange={(e) => setForm((p) => ({ ...p, maxGuests: Number(e.target.value) }))}
                    required
                    min={1}
                    className="w-full px-4 py-3 border-2 border-[#E8614A]/40 rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E4DE]">
            <h2 className="font-serif text-xl font-semibold text-[#1B2B40] mb-6 pb-4 border-b border-[#E8E4DE]">
              🖼️ Image
            </h2>
            <div>
              <label className="block text-sm font-bold text-[#1B2B40] mb-2">Image URL</label>
              <input
                type="url"
                value={form.media[0]?.url || ''}
                onChange={(e) => setForm((p) => ({ ...p, media: [{ url: e.target.value, alt: p.media[0]?.alt || p.name }] }))}
                className="w-full px-4 py-3 border-2 border-[#E8614A]/40 rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] transition-colors"
              />
              {form.media[0]?.url && (
                <img
                  src={form.media[0].url}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl mt-3"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E4DE]">
            <h2 className="font-serif text-xl font-semibold text-[#1B2B40] mb-6 pb-4 border-b border-[#E8E4DE]">
              ✨ Amenities
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {([
                { key: 'wifi', label: 'WiFi', icon: '🌐' },
                { key: 'parking', label: 'Parking', icon: '🅿️' },
                { key: 'breakfast', label: 'Breakfast', icon: '🍳' },
                { key: 'pets', label: 'Pets allowed', icon: '🐾' },
              ] as const).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, meta: { ...p.meta, [item.key]: !p.meta[item.key] } }))}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-sm font-medium transition-colors ${
                    form.meta[item.key]
                      ? 'border-[#E8614A] bg-[#E8614A]/5 text-[#E8614A]'
                      : 'border-[#E8E4DE] bg-[#FAF6F0] text-[#8A8F9A]'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                  {form.meta[item.key] && <span className="ml-auto">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E4DE]">
            <h2 className="font-serif text-xl font-semibold text-[#1B2B40] mb-6 pb-4 border-b border-[#E8E4DE]">
              📍 Location
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-[#1B2B40] mb-2">Address</label>
                <input
                  type="text"
                  value={form.location.address}
                  onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, address: e.target.value } }))}
                  className="w-full px-4 py-3 border-2 border-[#E8614A]/40 rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#1B2B40] mb-2">City</label>
                  <input
                    type="text"
                    value={form.location.city}
                    onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, city: e.target.value } }))}
                    className="w-full px-4 py-3 border-2 border-[#E8614A]/40 rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1B2B40] mb-2">Country</label>
                  <input
                    type="text"
                    value={form.location.country}
                    onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, country: e.target.value } }))}
                    className="w-full px-4 py-3 border-2 border-[#E8614A]/40 rounded-xl text-sm text-[#2D3340] bg-[#FAF6F0] outline-none focus:border-[#E8614A] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#E8614A] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#d4553f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
            <Link
              to="/profile"
              className="border border-[#E8E4DE] text-[#2D3340] font-semibold px-8 py-4 rounded-xl hover:bg-[#E8E4DE] transition-colors text-sm"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}