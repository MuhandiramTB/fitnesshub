'use client';

import Image from 'next/image';

export default function TrainerProfiles() {
  const trainers = [
    {
      name: 'Trainer A',
      role: 'Certified Fitness Coach',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHjZ4GDkIyshIiFdwGof2YyLQEWHc22lpMzKTBIqvvf_ks3lxYo1kWC6nnGJKPkfC-rlzzys2bt38N3GNCuZR2B6gLHF1XQbyNa7IzNnpETKlyUgLT2opdYuWuRYM3nRTMnUgQP29w7wlZCWKDhAzDC3ue3rS7QevzTtkf5N-NQPsesL1vqygqZZ7iCEs0fnJVRu_wD7r91skZNtd_YSJvx7kjZyXazIo3u-wVzTRTsgL1TVHypNfDhGkISAgdoOcPzedeUNljVVyt'
    },
    {
      name: 'Trainer B',
      role: 'Strength Training Specialist',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoa_GaNTfgDbSmrCD0DZJobFKxtWqs_Xgw30p_0Z2hZ9rRazWFXG64kRrQDtemr_ZzQ4zZGRgaYZ0Mu8zhv1Yc-tQWyjrQvkOYESOjKCEo9CTxfh0sW19B_lymjEjEP87qt2gve0CQdfGn6bbaHawVfJsu5ZXmAycwWybKvW0BdNnHwQ0Ib6bXO2m4abBvG9BvmskZqKP2aAVPRV6mNk1LZTbTJx0dtuNU_2K9bFabTEzGjQU7W-THCr1s5zpSbtyCHDDSxCppTpea'
    },
    {
      name: 'Trainer C',
      role: 'Yoga Instructor',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYmQU3b1CRvTTzasFGWaB4vmdMYx308CfrEhl3C1M6zG9eMRUqAzsmzzCJIQJ4lRYKJEWLyVpD3dRWWD-hPllzo0HzZTxQt4PBaeRoKBptqV97Cs9A6xkL52doEye2rbxgZjknY_ZE1o2a8iu5oRWiIHOspf8urC1tpvuwWxFNGSFWP_480dAgWvDHlmuGBepbDQdP8YfoVFMif_q2g54UZi6H_L5_4EzUtxXLIagYiO2qXqKTMi15-rJY_c3AHvQOgu1IJVO7rtCX'
    }
  ];

  return (
    <>
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Trainers</h2>
      <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-stretch p-4 gap-8">
          {trainers.map((trainer, index) => (
            <div key={index} className="flex h-full flex-1 flex-col gap-4 text-center rounded-lg min-w-32 pt-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full flex flex-col self-center w-full"
                style={{ backgroundImage: `url("${trainer.image}")` }}
              />
              <div>
                <p className="text-white text-base font-medium leading-normal">{trainer.name}</p>
                <p className="text-[#9eb7a8] text-sm font-normal leading-normal">{trainer.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 