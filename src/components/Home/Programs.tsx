export default function Programs() {
  const programs = [
    {
      title: "Yoga and Mindfulness",
      description: "Find your inner peace and improve flexibility with our yoga sessions.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEgrrO3xYFK8fUMSFcu0FEOhlvmNl_iPjJg-gyN6lPRKl5hgYLB6_UwspwPVrmW5FNyaCbl1Z2QlWvk2JiN6IUVHDY1BpMvmH1sbYMsTR0ZI-K13df8gRojRQxBH053mNFgckJvNkL3-I-zdfhy-QQR08tEJ7g25QiNDxVG1bR834P9UZjp4U3OLk5FGV403nW4VQ8Lt7t-xzZaqI3bHeggANKu4bRPyBDeE-bVzoHPOdfDFEqqMP5Sz9PoCOar8hJZVYtHFYnK1Ou"
    },
    {
      title: "Strength and Conditioning",
      description: "Build strength and endurance with our expert-led conditioning programs.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCReWDxgsbYjktqMIpfFKFecxE6UEzYR2C3BMe2lLayuwV5YWGAgPjiOP-KgK2fhq4JGGojLCnRQGv_a98gzPoSplCsYX1CPHFKrG6ucx1B2-9zUx_pnWU3RNVcSoJdZy_QRcYTCKyhykm9yL69S-upTs3g6sKahMExNRA0b02nGzO9hdgUqDBrfZ2lSnHPmZpcfdHzX77lxQke8RiIxRQss7ofNk1MvQTMDyez2kx7bfCpoI2Lc5nA5iUNSz9c8bq2ND1w9E00zar"
    },
    {
      title: "Cardio Blast",
      description: "Boost your cardiovascular health with our high-energy cardio workouts.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTD-QlBP8rTLG_jt8L9KE1j4o-Ne0nnuerdZQ3hjdwNfjAi0vf8mR_lFbhyDiud1je0BC83XbknfLb1rKwcms2zHQ9JzWxhEPUb4okCeTvuiMdA7PdGSsgnpmTDKVCDdUmZhjZ5fUjWe3J26qJD0-s8M_RKPeoPnTWaDA3nUGeAcapGxJpn1BFcZoE-_xOpL_7OGcaeWUF9YOLSeEtctF4wg2G8ZHidTzJdamVCkXdaWhDQB0XbXKFRMtNZF067vssDlo79xa694e4"
    }
  ];

  return (
    <div className="mt-8">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">Programs</h2>
      <div className="px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <div key={index} className="flex flex-col gap-4 rounded-lg">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex flex-col relative group cursor-pointer overflow-hidden"
                style={{ backgroundImage: `url("${program.image}")` }}
              >
                {/* Dark overlay that's always visible slightly */}
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Additional dark overlay that shows on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Program title that shows on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-lg font-bold text-center px-4">{program.title}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-white text-lg font-medium leading-tight">{program.title}</p>
                <p className="text-[#9eb7a8] text-sm font-normal leading-relaxed">{program.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 