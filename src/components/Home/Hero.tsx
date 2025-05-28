'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  const handleJoinNow = () => {
    router.push('/membership');
  };

  return (
    <div className="relative w-full min-h-[100svh] bg-[#111714]">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL6TGTzoCI6kdr8JjqPlvNGITRHm88Ss6BnKty3UprETLGGN9elTIOtWCLINRnEfVff-4a6A8M6jVx1a33xDlSz1qvqVGYifXmf1H3k2j0Zcqr7eeYTjL_Wf5YVAZ1RuhxkvlHDvSD-lcsGNnRXcJ-xwGJNMN1nBXhImy0PR3JKbXgSQ2DxNzFH6-4E9h70nGC8AxbAab3JpIuyfj_qlBUL6F0hOWr8OJwyCH3DHaMmnAtxplSxmK4K7OddswtwQorkCjwnSC6epZw"
          alt="Fitness training"
          fill
          className="object-cover opacity-40"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 100vw"
          quality={90}
          loading="eager"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8">
        <div className="max-w-[90%] md:max-w-2xl lg:max-w-4xl mx-auto">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in-up leading-tight">
            Transform Your Life with Fitness Hub
          </h1>
          <p className="text-white/90 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 animate-fade-in-up animation-delay-200 max-w-xl sm:max-w-2xl mx-auto">
            Join us for a journey of health and wellness. Experience our expert training and supportive community.
          </p>
          <button 
            className="bg-[#38e07b] text-[#111714] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-[#2bc665] transition-all duration-300 animate-fade-in-up animation-delay-400 hover:scale-105 active:scale-95"
            onClick={handleJoinNow}
            aria-label="Navigate to membership page"
          >
            Join Now
          </button>
        </div>

        
      </div>
    </div>
  );
} 