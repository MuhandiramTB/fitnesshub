'use client';

import { useState } from 'react';
import Hero from '@/components/Home/Hero';
import TrainerProfiles from '@/components/Home/TrainerProfiles';
import Reviews from '@/components/Home/Reviews';
import Programs from '@/components/Home/Programs';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegisterModal from '@/components/Auth/RegisterModal';

export default function Home() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111714] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar/>
        <div className="px-4 sm:px-6 md:px-8 lg:px-40 flex flex-1 justify-center py-5 mt-4">
          <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
            <Hero />
            <div className="mt-8">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">Our Story</h2>
              <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4">
                Fitness Hub was founded with a vision to transform lives through fitness. Our journey began with a small group of dedicated trainers and a passion for health and wellness. Today, we are a leading fitness center, committed to providing exceptional training and support to our members.
              </p>
            </div>
            <Programs/>
            <TrainerProfiles />
            <Reviews/>
            
            <div className="@container">
              <div className="flex flex-col justify-end gap-4 sm:gap-6 px-4 py-8 sm:py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
                <div className="flex flex-col gap-2 text-center">
                  <h1 className="text-white tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                    Ready to Transform Your Life?
                  </h1>
                  <p className="text-white text-base font-normal leading-normal max-w-[720px]">
                    Sign up today and start your fitness journey with us.
                </p>
                </div>
                <div className="flex flex-1 justify-center w-full">
                  <label className="flex flex-col w-full min-w-[280px] sm:min-w-40 h-14 max-w-[480px] flex-1 @[480px]:h-16">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                      <input
                        placeholder="Your Email"
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#29382f] focus:border-none h-full placeholder:text-[#9eb7a8] px-4 rounded-r-none border-r-0 pr-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal"
                      />
                      <div className="flex items-center justify-center rounded-r-xl border-l-0 border-none bg-[#29382f] pr-2">
                        <button
                          onClick={() => setIsRegisterModalOpen(true)}
                          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#38e07b] text-[#111714] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                          <span className="truncate">Join Now</span>
                        </button>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onCloseAction={() => setIsRegisterModalOpen(false)} 
      />
    </div>
  );
}
