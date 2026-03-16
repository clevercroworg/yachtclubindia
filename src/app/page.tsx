'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Anchor, MessageCircle, ChevronLeft, ChevronRight, MapPin, Compass, Instagram } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ExperienceCard } from '@/components/ui/ExperienceCard';
import { FleetCard } from '@/components/ui/FleetCard';

import experiencesData from '@/data/experiences.json';
import fleetData from '@/data/fleet.json';
import testimonialsData from '@/data/testimonials.json';
import faqsData from '@/data/faqs.json';
import { InstagramEmbed } from '@/components/ui/InstagramEmbed';

// --- Sub-components for page sections --- //

function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline>
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay absolute inset-0"></div>

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-28" data-reveal="true">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-3 text-sm tracking-[0.2em] text-gold uppercase">
            Yacht Club India
            <span className="h-px w-16 bg-gold/70"></span>
          </p>
          <h1 className="font-heading text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Private Luxury Yacht Charters in Goa
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[#D6DEE8]">
            Curated experiences across the Arabian Sea, crafted for intimate escapes, celebrations, and elevated coastal moments.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/fleet" variant="gold" icon={Anchor}>Book Now</Button>
            <Button href="https://wa.me/918147331594" variant="outline" icon={MessageCircle} className="hero-btn-outline">Chat on WhatsApp</Button>
          </div>
          <p className="mt-4 text-sm text-[#C4D0DD]">Starting from ₹7,500 / hour</p>
        </div>
      </div>
    </section>
  );
}

function ExperiencesSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const moveTrack = (dir: number) => {
    if (trackRef.current) {
      const card = trackRef.current.querySelector('.exp-card');
      const step = card ? card.getBoundingClientRect().width + 24 : 320;
      trackRef.current.scrollBy({ left: dir * step, behavior: 'smooth' });
    }
  };

  return (
    <section id="experiences" className="section-surface py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10" data-reveal="true">
          <h2 className="section-title">Signature Experiences</h2>
          <p className="section-subtitle">Choose from curated journeys designed for Goa&apos;s most beautiful hours.</p>
          <div className="exp-controls mt-5 flex items-center justify-end gap-2">
            <button className="exp-control-btn" aria-label="Previous experiences" onClick={() => moveTrack(-1)}>
              <ChevronLeft />
            </button>
            <button className="exp-control-btn" aria-label="Next experiences" onClick={() => moveTrack(1)}>
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="relative" data-reveal="true">
          <div ref={trackRef} className="flex gap-6 overflow-x-auto pb-2 pr-6 no-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
            {experiencesData.map((exp) => (
              <ExperienceCard key={exp.id} {...exp} />
            ))}
            {/* Duplicate for infinite scroll feel if needed */}
            {experiencesData.map((exp) => (
              <ExperienceCard key={`${exp.id}-dup`} {...exp} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LuxeCTASection() {
  return (
    <section className="luxe-cta-wrap">
      <div className="luxe-cta-box" data-reveal="true">
        <div className="luxe-cta-inner">
          <div className="luxe-cta-copy">
            <p className="luxe-cta-kicker">Experience Goa from the Sea</p>
            <h3 className="luxe-cta-title">Reserve Your Private Charter Today</h3>
          </div>
          <Button href="/booking" variant="gold" icon={Anchor} className="luxe-cta-btn text-white" style={{ background: '#102A47', borderColor: 'rgba(9, 25, 45, 0.35)' }}>
            Book a Yacht
          </Button>
        </div>
      </div>
    </section>
  );
}

function FleetSection() {
  return (
    <section id="fleet" className="bg-[#F4F7FB] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle title="Our Fleet" subtitle="Handpicked yachts for private escapes, celebrations, and corporate hosting." />

        <div className="mb-8 flex flex-wrap items-center gap-3" data-reveal="true">
          <button className="chip">Capacity ▾</button>
          <button className="chip">Price ▾</button>
          <button className="chip">Duration ▾</button>
          <button className="chip">Type ▾</button>
          <div className="ml-auto">
            <label htmlFor="sort" className="sr-only">Sort</label>
            <select id="sort" className="chip">
              <option>Featured</option>
              <option>Price</option>
              <option>Capacity</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal="true">
          {fleetData.map((yacht) => (
            <FleetCard key={yacht.id} {...yacht} tag={yacht.tag as any} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OccasionsSection() {
  const occasions = [
    { title: 'Proposals', image: '/images/s1.jpg', href: '/occasions/proposals' },
    { title: 'Birthdays', image: '/images/s2.jpg', href: '/occasions/birthdays' },
    { title: 'Romantic Getaways', image: '/images/s3.jpg', href: '/occasions/romantic-getaways' },
    { title: 'Weddings', image: '/images/s4.jpg', href: '/occasions/weddings' },
    { title: 'Corporate', image: '/images/s5.jpg', href: '/occasions/corporate' },
  ];

  return (
    <section id="occasions" className="occasions-luxe py-28">
      <div className="mx-auto max-w-7xl px-6" data-reveal="true">
        <h2 className="section-title text-white">Occasions at Sea</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {occasions.map((occ, idx) => (
            <Link key={idx} href={occ.href} className="occasion-tile">
              <Image src={occ.image} alt={occ.title} fill />
              <span>{occ.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section id="about" className="location-section bg-[#F4F7FB] py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
        <div data-reveal="true">
          <SectionTitle
            title="Location & Service Areas"
            subtitle="Board from the heart of Goa and cruise routes designed for both tranquil escapes and vibrant celebrations."
            align="left"
            noDivider
          />
          <div className="location-points mt-10 space-y-4">
            <p className="location-item"><MapPin className="text-gold" /><span><span className="text-gold">Boarding Point:</span> Brittona Jetty, Panjim</span></p>
            <p className="location-item"><Compass className="text-gold" /><span><span className="text-gold">Service Areas:</span> North Goa & South Goa</span></p>
          </div>
        </div>
        <div data-reveal="true">
          <div className="map-ph">
            <iframe
              title="Yacht Club India boarding point map"
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d15379.524304324936!2d73.81148447611676!3d15.490827737741519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sBrittona%20Jetty%2C%20Panjim!5e0!3m2!1sen!2sin!4v1771985595168!5m2!1sen!2sin"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
          <a
            href="https://maps.app.goo.gl/a6WpobfVfr3rUrq86"
            target="_blank"
            rel="noopener noreferrer"
            className="map-link mt-4 inline-flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Open in Google Maps</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  // Split data into two rows to match the original two tracks (forward and reverse)
  const half = Math.ceil(testimonialsData.length / 2);
  const track1Data = testimonialsData.slice(0, half);
  const track2Data = testimonialsData.slice(half);

  const renderCard = (t: any, i: number, suffix: string) => (
    <article key={`${i}-${suffix}`} className="testimonial-card">
      <div className="testimonial-head">
        <div className="testimonial-stars" aria-label="5 star rating">★★★★★</div>
        <div className="testimonial-platforms" aria-label="Review platforms">
          <span className="platform-dot">{t.platform === 'google' ? 'G' : <Instagram className="w-3 h-3" />}</span>
        </div>
      </div>
      <p>&quot;{t.quote}&quot;</p>
      <div className="testimonial-meta">{t.author} • {t.location}</div>
    </article>
  );

  return (
    <section id="testimonials" className="testimonials-section section-surface py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle title="Guest Testimonials" subtitle="Real words from guests who chose Yacht Club India for unforgettable sea experiences." />

        <div className="space-y-4" data-reveal="true">
          {/* Scroll Track 1 (Forward) */}
          <div className="testimonial-track-wrap">
            <div className="testimonial-track">
              {track1Data.map((t, i) => renderCard(t, i, 't1'))}
              {track1Data.map((t, i) => renderCard(t, i, 't1-dup'))}
            </div>
          </div>

          {/* Scroll Track 2 (Reverse) */}
          <div className="testimonial-track-wrap">
            <div className="testimonial-track reverse">
              {track2Data.map((t, i) => renderCard(t, i, 't2'))}
              {track2Data.map((t, i) => renderCard(t, i, 't2-dup'))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstagramSection() {
  const reelIds = ['DSjo5HTEwY7', 'DNVSbGsTMGl', 'DUDpRS1CLHa', 'DVsgxz4k6rX'];

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, []);

  return (
    <section className="section-surface py-28">
      <div className="mx-auto max-w-7xl px-6" data-reveal="true">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="section-title no-divider">Instagram</h2>
          <Button href="#" variant="outline" icon={Instagram}>Follow @yachtclubindia_</Button>
        </div>
        <div className="reels-grid mt-12">
          {reelIds.map((id) => (
            <div key={id} className="reel-item">
              <InstagramEmbed id={id} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className="bg-[#F4F7FB] py-28">
      <div className="mx-auto max-w-4xl px-6" data-reveal="true">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-3" id="faq-list">
          {faqsData.map((faq) => (
            <article key={faq.id} className="faq-item">
              <button
                className="faq-trigger"
                aria-expanded={openFaq === faq.id}
                onClick={() => toggleFaq(faq.id)}
              >
                {faq.question}
              </button>
              <div
                className="faq-panel"
                style={{ maxHeight: openFaq === faq.id ? '200px' : '0' }}
              >
                {faq.answer}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6" data-reveal="true">
        <div className="rounded-3xl border border-black/10 bg-white p-8 sm:p-10 lg:flex lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.15em] text-gold">Ready to Sail</p>
            <h3 className="mt-2 font-heading text-2xl">Reserve Your Yacht Experience in Goa</h3>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
            <Button href="/fleet" variant="gold" icon={Anchor}>Book Now</Button>
            <Button href="https://wa.me/918147331594" variant="outline" icon={MessageCircle}>Chat</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    // Basic Intersection Observer for reveal animation
    const revealEls = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main>
      <HeroSection />
      <ExperiencesSection />
      <LuxeCTASection />
      <FleetSection />
      <OccasionsSection />
      <LocationSection />
      <TestimonialsSection />
      <InstagramSection />
      <FAQSection />
    </main>
  );
}
