import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import prisma from '@/lib/db';
import { getAddonById } from '@/data/addons';

const TIME_SLOT_LABELS: Record<string, string> = {
  '6AM-8AM': '6 AM – 8 AM',
  '8AM-10AM': '8 AM – 10 AM',
  '10AM-12PM': '10 AM – 12 PM',
  '12PM-2PM': '12 PM – 2 PM',
  '2PM-4PM': '2 PM – 4 PM',
  '4PM-6PM': '4 PM – 6 PM',
  '6PM-8PM': '6 PM – 8 PM',
  '8PM-10PM': '8 PM – 10 PM',
  '10PM-12AM': '10 PM – 12 AM',
  '12AM-2AM': '12 AM – 2 AM',
};

type ThankYouProps = {
  searchParams: Promise<{
    bookingId?: string;
    paymentId?: string;
  }>;
};

const formatDate = (value?: string) => {
  if (!value) return '--';
  const date = new Date(value);
  return date.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });
};

const formatSlot = (slot?: string) => {
  if (!slot) return '--';
  return TIME_SLOT_LABELS[slot] || slot;
};

const formatCurrency = (paise?: number | null) => {
  if (paise === null || paise === undefined) return '--';
  return (paise / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
};

export default async function ThankYouPage({ searchParams }: ThankYouProps) {
  const resolvedParams = await searchParams;
  const booking = resolvedParams.bookingId
    ? await prisma.booking.findUnique({ where: { id: resolvedParams.bookingId } })
    : resolvedParams.paymentId
      ? await prisma.booking.findFirst({ where: { razorpay_payment_id: resolvedParams.paymentId } })
      : null;

  const addons = Array.isArray(booking?.addons) ? booking?.addons : [];
  const addonIds = addons.filter((addonId): addonId is string => typeof addonId === 'string');
  const addonDetails = addonIds
    .map((addonId) => getAddonById(addonId))
    .filter((addon): addon is { id: string; label: string; price: number } => Boolean(addon));

  return (
    <main className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-[#F7F8FA]">
      <div className="w-full max-w-4xl">
        <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-black/5">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-gold" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-jakarta text-[#10233D] mb-4 text-center">
            {booking ? 'Booking Confirmed' : 'Booking Request Received'}
          </h1>
          <p className="text-textMuted mb-8 text-lg leading-relaxed text-center">
            {booking
              ? 'We have received your payment and confirmed the following yacht charter details. A member of our team will reach out shortly to finalize the itinerary.'
              : 'Thank you for choosing Yacht Club India. We have received your request and our team will be in touch soon.'}
          </p>

          {booking ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-black/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-textMuted mb-2">Yacht</p>
                  <p className="font-bold text-lg">{booking.yacht_title}</p>
                  <p className="text-sm text-textMuted mt-1">{booking.total_hours} hrs charter</p>
                </div>
                <div className="rounded-2xl border border-black/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-textMuted mb-2">Date &amp; Slot</p>
                  <p className="font-bold text-lg">{formatDate(booking.booking_date)}</p>
                  <p className="text-sm text-textMuted mt-1">{formatSlot(booking.time_slot)}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-black/5 p-4 space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-textMuted">Guest Details</p>
                <p className="font-semibold">{booking.customer_first_name} {booking.customer_last_name}</p>
                <p className="text-sm text-textMuted">{booking.customer_email}</p>
                <p className="text-sm text-textMuted">{booking.customer_phone}</p>
                {booking.customer_company && (
                  <p className="text-sm text-textMuted">{booking.customer_company}</p>
                )}
              </div>
              <div className="rounded-2xl border border-black/5 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-textMuted">
                  <span>Subtotal</span>
                  <span>{formatCurrency(booking.amount_in_paise)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-textMuted">
                  <span>Add-ons</span>
                  <span>{addons.length ? addons.length : 'None'}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-textMuted">
                  <span>Guests</span>
                  <span>{booking.guests || '--'}</span>
                </div>
              </div>
              {addonDetails.length > 0 && (
                <div className="rounded-2xl border border-black/5 p-4 space-y-2">
                  <p className="text-xs uppercase tracking-[0.15em] text-textMuted">Add-on Details</p>
                  {addonDetails.map((addon) => (
                    <div key={addon.id} className="flex items-center justify-between text-sm text-textMuted">
                      <span>{addon.label}</span>
                      <span>{formatCurrency(addon.price * 100)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="rounded-2xl border border-black/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-textMuted">
                  <span>Booking Status</span>
                  <span className="text-gold font-semibold">{booking.status ?? 'pending'}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-textMuted">
                  <span>Payment Status</span>
                  <span className="text-gold font-semibold">{booking.payment_status ?? 'pending'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-black/5 p-6 text-center text-sm text-textMuted/80">
              We are finalizing your booking. If this page does not update in a few seconds, please refresh.
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-[#10233D] hover:bg-[#0c1b2f] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-0.5"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
