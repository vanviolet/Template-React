import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, GraduationCap, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/images/education_login_hero_1790530174040.jpg';

export function LoginHeroCard() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      tagline: t('auth.heroTagline'),
      quote: t('auth.heroQuote'),
      author: t('auth.heroAuthor'),
      role: t('auth.heroRole'),
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    {
      tagline: 'Interactive Online Campus',
      quote: 'Membangun generasi cerdas berdaya saing global melalui pembelajaran terintegrasi dan teknologi modern.',
      author: 'Prof. Alexander Vance',
      role: 'Head of AI & Education Research',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const slide = slides[currentSlide];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-full w-full min-h-[500px] lg:min-h-[620px] rounded-2xl lg:rounded-[1.75rem] overflow-hidden flex flex-col justify-between p-6 sm:p-8 lg:p-10 select-none text-white shadow-xl">
      {/* Background Hero Image with Dark Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />

      {/* Top Header inside Hero */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
          <GraduationCap className="h-4 w-4 text-violet-300" />
          <span className="text-xs font-semibold tracking-wide text-white">
            Materio Education
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/80 hidden sm:inline-block">
            Ingin bergabung?
          </span>
          <button
            type="button"
            className="px-4 py-1.5 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all backdrop-blur-xs cursor-pointer"
          >
            Daftar Sekarang
          </button>
        </div>
      </div>

      {/* Bottom Content inside Hero */}
      <div className="relative z-10 space-y-6 pt-12">
        {/* Quote & Tagline */}
        <div className="space-y-3 max-w-lg">
          <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-violet-500/30 text-violet-200 rounded-full border border-violet-400/20 backdrop-blur-md">
            {slide.tagline}
          </span>
          <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-100 font-sans italic">
            "{slide.quote}"
          </p>
        </div>

        {/* Educator Avatar & Carousel Navigation */}
        <div className="flex items-end justify-between gap-4 pt-2 border-t border-white/15">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={slide.avatar}
                alt={slide.author}
                className="h-11 w-11 rounded-full object-cover border-2 border-violet-400/50 shadow-md"
              />
              <span className="absolute -bottom-0.5 -right-0.5 bg-violet-500 text-white rounded-full p-0.5 shadow-xs">
                <CheckCircle className="h-3 w-3" />
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-tight">
                {slide.author}
              </span>
              <span className="text-[11px] text-slate-300 font-medium">
                {slide.role}
              </span>
            </div>
          </div>

          {/* Nav Controls (Arrow Left/Right) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="h-9 w-9 rounded-full border border-white/25 bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all backdrop-blur-xs cursor-pointer active:scale-95"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="h-9 w-9 rounded-full border border-white/25 bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all backdrop-blur-xs cursor-pointer active:scale-95"
              aria-label="Next slide"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
