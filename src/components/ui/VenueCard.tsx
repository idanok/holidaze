import { Link } from 'react-router-dom';
import type { Venue } from '../../types';

interface Props {
  venue: Venue;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';

export default function VenueCard({ venue }: Props) {
  const image = venue.media?.[0]?.url || FALLBACK_IMAGE;
  const alt = venue.media?.[0]?.alt || venue.name;
  const city = venue.location?.city || 'Unknown location';
  const country = venue.location?.country || '';

  return (
    <Link to={`/venues/${venue.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        {venue.rating > 0 && (
          <div className="absolute top-3 right-3 bg-white text-[#1B2B40] text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
            <span className="text-[#F2C784]">★</span>
            {venue.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-xs text-[#8A8F9A] mb-1">
          📍 {city}{country ? `, ${country}` : ''}
        </p>
        <h3 className="font-serif text-lg font-semibold text-[#1B2B40] mb-3 leading-tight line-clamp-1">
          {venue.name}
        </h3>

        {/* Amenities */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {venue.meta?.wifi && (
            <span className="text-xs bg-[#FAF6F0] border border-[#E8E4DE] text-[#2D3340] px-2.5 py-1 rounded-full">🌐 WiFi</span>
          )}
          {venue.meta?.parking && (
            <span className="text-xs bg-[#FAF6F0] border border-[#E8E4DE] text-[#2D3340] px-2.5 py-1 rounded-full">🅿️ Parking</span>
          )}
          {venue.meta?.breakfast && (
            <span className="text-xs bg-[#FAF6F0] border border-[#E8E4DE] text-[#2D3340] px-2.5 py-1 rounded-full">🍳 Breakfast</span>
          )}
          {venue.meta?.pets && (
            <span className="text-xs bg-[#FAF6F0] border border-[#E8E4DE] text-[#2D3340] px-2.5 py-1 rounded-full">🐾 Pets</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E8E4DE]">
          <div>
            <span className="font-serif text-xl font-bold text-[#1B2B40]">
              NOK {venue.price.toLocaleString()}
            </span>
            <span className="text-xs text-[#8A8F9A] ml-1">/ night</span>
          </div>
          <div className="text-xs text-[#8A8F9A]">
            👥 Max {venue.maxGuests}
          </div>
        </div>
      </div>
    </Link>
  );
}