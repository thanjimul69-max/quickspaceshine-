import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Which areas in Chennai does Quick Space Shine serve?',
      a: 'We serve all pincodes within ~15-20km radius of our Guindy HQ (600032), including Velachery (600042), Saidapet (600015), Adyar (600020), Madipakkam (600091), Perungudi (600096), Medavakkam (600100), Ashok Nagar (600083), KK Nagar (600085), Mylapore (600004), and surrounding locations. Enter your pincode above to check instant availability!',
    },
    {
      q: 'Why is Appliance Cleaning an add-on requiring Complete Kitchen Cleaning?',
      a: 'Appliance care (refrigerators, chimneys, microwaves) requires our heavy-duty steam equipment and chemical setup already deployed at your location during a Complete Kitchen Cleaning session. Hence, appliance cleaning cannot be booked standalone.',
    },
    {
      q: 'How does payment work?',
      a: 'Zero advance payment required! You inspect the clean kitchen and bathroom upon completion. Once 100% satisfied with our steam-cleaned results, you can pay via UPI (GPay, PhonePe, Paytm), cash, or bank transfer.',
    },
    {
      q: 'Are the cleaning chemicals safe for modular kitchen laminates and granite?',
      a: 'Yes! We use Shuma Multi (pH balanced) for laminate cabinet fronts and granite slabs, Shuma Grill specifically for heavy oil/grease on tiles & chimney filters, and AZI Steel Shiner for stainless steel polish. They leave zero residue or discoloration.',
    },
    {
      q: 'What do I need to prepare before the technicians arrive?',
      a: 'Please ensure: (1) One functional power switchboard for our steam machine, (2) One stool or ladder to reach top cabinets & exhaust fans, and (3) One bucket for water supply.',
    },
    {
      q: 'How long does a Complete Kitchen & Bathroom cleaning session take?',
      a: 'A complete kitchen deep steam cleaning typically takes 2.5 to 3.5 hours, depending on oil grease accumulation. Bathroom descaling takes about 45 to 60 minutes per bathroom.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-900 uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-black" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-black transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-black shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
