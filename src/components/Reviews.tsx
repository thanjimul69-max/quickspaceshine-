import React from 'react';
import { Star, Quote, CheckCircle2, ThumbsUp } from 'lucide-react';

export const Reviews: React.FC = () => {
  const reviewsList = [
    {
      name: 'Karthik Subramanian',
      location: 'Velachery, Chennai (600042)',
      service: 'Complete Kitchen + Chimney Degreasing',
      rating: 5,
      date: '3 days ago',
      comment:
        'Unbelievable steam machine result! Our chimney baffle filters had 2 years of thick oil buildup. The QSS team used Shuma Grill chemical and steam spray — it melted off in 10 minutes. Super polite technicians from Guindy.',
    },
    {
      name: 'Priya Rajesh',
      location: 'Adyar, Chennai (600020)',
      service: 'Kitchen Base + Side by Side Fridge + 2 Bathrooms',
      rating: 5,
      date: '1 week ago',
      comment:
        'Deep bathroom cleaning was truly not normal cleaning. The hard water white scale marks on our shower glass partition are 100% gone! Polished all taps with AZI Steel Shiner. Worth every rupee.',
    },
    {
      name: 'Venkatesh Kumar',
      location: 'Guindy / Thangalamber Nagar (600032)',
      service: 'Complete Kitchen Cleaning (₹1,999)',
      rating: 5,
      date: '2 weeks ago',
      comment:
        'Booked on WhatsApp in 2 minutes. The team arrived on time with ladder and steam machine. Kitchen cabinet interiors and gas stove look brand new. Paid after service satisfaction.',
    },
  ];

  return (
    <section id="reviews" className="py-16 lg:py-24 bg-white relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-pink-700 uppercase tracking-widest">
            <ThumbsUp className="w-3.5 h-3.5 text-pink-500" />
            <span>Verified Chennai Customer Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Loved By Over{' '}
            <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              380+ Chennai Homes
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Read real feedback from homeowners in Guindy, Velachery, Adyar, Saidapet & surrounding areas.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {reviewsList.map((rev, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-6 bg-white border border-slate-200 flex flex-col justify-between space-y-4 shadow-md hover:shadow-xl transition-all"
            >
              <div className="space-y-3">
                {/* Stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{rev.date}</span>
                </div>

                <Quote className="w-8 h-8 text-pink-200" />

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-medium">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" />
                  </h4>
                  <p className="text-[11px] text-slate-500">{rev.location}</p>
                </div>

                <span className="px-2 py-0.5 rounded bg-pink-50 text-pink-700 border border-pink-200 text-[10px] font-bold">
                  {rev.service.split('+')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
