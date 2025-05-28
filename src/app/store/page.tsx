'use client';

import { useState } from 'react';

const products = {
  featured: [
    {
      name: 'Performance T-Shirt',
      description: 'Lightweight, breathable fabric',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbecf7Qxc3VkXErxljWul4NwmbMQMFNxRbM3tom1ESHoe8s2TcuSTpxLLgJpYL9SkK23yckEeT8RZdILQeO-rYSWi7c5Mt26kBKSl4UH0okTt1XQkwgnhrOcInxPSlZh6ZiVn-cqvUcsQlQsumgkIjdI9Qz7UDToJ7jj3o-0ljy5x8KSJKqL1VHpsvlS4LLVyQ1uxC_lFdl4tB_UGEpwLXE2PmrPLUEBoPqMD7Vz_RlILoW-nMdvfu-BwGaAd-of6PaAD7ZL3gZcyN'
    },
    {
      name: 'Whey Protein Isolate',
      description: 'High-quality protein for muscle recovery',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu5fTDrjwoGoqi8o-nFiQPv9IblB55hTl6UMw_GXwfrPy9Zu3sxEWXjS1OBXUETeNrZh3vGoIpU4CfWmNo3wgRAmZA2gKjoucsO9RsgPHi_8Z4oyF67Q_necDCKJHuYVVX-3GCY0r7UqDbEAQcNDM62tFXd_q2hPaG5GKkQ8ocBe5z-mGq6A2UBt1fKFWBzDz1_-8j87io0gIyr1AYS_U2mokKa37YY3ZvpY6CzWmuDXEQD6EQPGS8p7tm_VC0beSS8_e3BL6btRet'
    },
    {
      name: 'Adjustable Dumbbell Set',
      description: 'Versatile weight training',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBbOglNuQYfduIpkKiCZNMfchnc8zZGTtpiLJFaiTc4LGviShCv8-GygPL7eyOWiTTjMzW2wam2EZn2-NvnSSpG0Qzzun0wffhAlKR1SoA_d49q2U_5WaLcA17MVBkk6495JcVUsw6FuXSXXahk4XycGo9CRPSPxXTwJx67JCmE4xDg7edKQjIZcuiuaOg_liYJwufbqEgOYO2QCSgE-BKAUVAqa34_T48zuclSI8qU-EZG-RTn-WSHvxQhj6Z7nAtlwClKFaNc4Hy'
    },
    {
      name: 'Resistance Bands',
      description: 'Various resistance levels',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxwDmDV4R6oAI434nsl9zIGWhNi9srZbYcqRnk8YrrQsaPV_uZP-RYHP1pcgSD6V-6eQzsvrF4gFIOvqISEKO-6OESrYWDenqqvvTsmQsYaN4uOL4IhnPYX7ZhAG8ef9M2BJj-JXxsb-VQaIvQ6CwibH_XQ7nSUb3sfGQXQ9KH63gdWJyn6N8FPP4lz0LjWvyAirAKnReEBq6Ob_bu0Io5LAPPZ1UBHXxtXxouviZ_maef-C6-0JpKWzI4NPn87c-0d--_qBeJO6c_'
    }
  ],
  favorites: [
    {
      name: 'Yoga Mat',
      description: 'Non-slip surface for yoga practice',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSFYiflWQk9G5GXLQbpEB06_fYsbGXuetEQVykQnRtI1yieXvRKMOl4sxU-MrmydFmpmusOc26X3yP05eWWKcURI7wYkhYe2tGw66Y7Or6bcGQS9RlWWmbJ3ewUwWrnv59wzGLQx5JR5HjcneoJn8gzRFXYnr7VQPtIQJfVcDphXg8yZxPl1MLCQXoG4QvduN7f8oi9B4vRfB8qQ_Pa4bxfX8qCWG_laJEzNzzjJy-JypdGFBPI3pWwgDhSkRC-PcNzbghYfnf2-3v'
    },
    {
      name: 'Protein Bars',
      description: 'Healthy snack for energy boost',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD68tu9bKjjEhBDNrcgDMEn2BoqpA9vnYHEGJm1m5jfHknJCHCJD0mj0VjGuJi8B_hIpUtZ-Ex9kDP5Mrh6bO5pSuCZH_vJq-OOJC_tkuBplAemZpUYd0piklj5L0-UE_AyPSS1HnPcZDOb68o_nM1vZ5-_Z-3S_5d9zl_G_8KmpgZXJSR5CfvfUN5TlOxhBQBGlqnQni2q1-uFIFc9NT9-oVDVm-VdCkKDHGOtbqr2rT8prITuOlakyOVDeOtBvuzbcVhKvae1vcro'
    },
    {
      name: 'Jump Rope',
      description: 'Adjustable length for cardio',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjOiidV03vLa30BMIdsC85XDtqSfbdnfX46_rt2_JzybsX_2uTmmi6F1w8vt2RsXKaBLncQFHze7HA0Y5H5rc0riWRWwQlJUbqGICyPMBN1FROka4nBv826FQLHogFPidGTN76RzEqs0DFDK4wH8Y0q3oCTMyQ6v7n_oDiFBmmy21B1-kyaohpt5dAP_dyEbH81Q0WS3E4calUWYwd46MF_Io5q541XhaR-w9EVVj3FKiQPGElv2bxnNSZ6_4ykt2mtatXPoGWaG9f'
    },
    {
      name: 'Water Bottle',
      description: 'Leak-proof design',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkAHpzGzKP0F1Jp82JCIAF829VINPi7Rgk9io-igOXXhppUwuFBZMDtaXpIPBhMW2t0dlb6LKMOVGbz9l2JG9KT411I4pnzA0pbHEWfv8M4vW4toVb0NNmOEAJYcpZTUx49GnNi_hzrPwjxU98CHafDBnQ7ZDtXOAKh6wkcvWpULgT-Bh_mWvnKbCnv5bKxtEaW_AYwJsUiUL6gGl1f995n8Olvj6aT7kO6_gQ5GRA3kqrUpHhld7zHhXDx6paUY1w_CBpXPLslVA3'
    }
  ]
};

const categories = ['Apparel', 'Supplements', 'Equipment', 'Accessories'];

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-8 mt-16 ">
      <div className="flex flex-col max-w-[960px] flex-1">
        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="flex w-full items-stretch rounded-xl h-12">
            <div className="text-[#9eb7a8] flex border-none bg-[#29382f] items-center justify-center pl-4 rounded-l-xl border-r-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#29382f] focus:border-none h-full placeholder:text-[#9eb7a8] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 p-3 flex-wrap">
          {categories.map((category) => (
            <div key={category} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#29382f] px-4">
              <p className="text-white text-sm font-medium leading-normal">{category}</p>
            </div>
          ))}
        </div>

        {/* Featured Products */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
          {products.featured.map((product) => (
            <div key={product.name} className="flex flex-col gap-3 pb-3">
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                style={{ backgroundImage: `url("${product.image}")` }}
              />
              <div>
                <p className="text-white text-base font-medium leading-normal">{product.name}</p>
                <p className="text-[#9eb7a8] text-sm font-normal leading-normal">{product.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Favorites */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Customer Favorites
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
          {products.favorites.map((product) => (
            <div key={product.name} className="flex flex-col gap-3 pb-3">
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                style={{ backgroundImage: `url("${product.image}")` }}
              />
              <div>
                <p className="text-white text-base font-medium leading-normal">{product.name}</p>
                <p className="text-[#9eb7a8] text-sm font-normal leading-normal">{product.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Options */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Payment Options
        </h2>
        <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4">
          We offer convenient payment options, including Cash on Delivery (COD) for orders within Sri Lanka. Other payment methods include credit/debit cards and online bank transfers.
        </p>
      </div>
    </div>
  );
}
