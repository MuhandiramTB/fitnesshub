'use client';

import Image from 'next/image';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Nadeera',
      time: '2 months ago',
      rating: 5,
      comment: 'Fitness Hub has completely changed my life. I\'ve lost weight, gained confidence, and feel healthier than ever. The trainers are incredibly supportive and knowledgeable.',
      likes: 15,
      dislikes: 2,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI6ndz-aFNkjiMcr2Av7mROGT0U2EMJfR1W_XK4L23C9gaT1PSDkqEaEt_Pyb9RAVAdVIdvIdjIbmdOZqKys3zDuD-44QUpnLV-Ej1O7MfJc8Q63AI6onuT9HRzymDneEm2mOZQNhqhGAFfNYbpRTUcZvvQOKz3Snce5eyYHmhYgcarFwzOXVY-GAse3CtD5BQuO145jd2EuATDEeIIV-TuZYPg-44jDaAKR0W7SAqkOW3QxTzLp96dU9nJsqR1vAGaujfvdyaHh64'
    },
    {
      name: 'Chandima',
      time: '3 months ago',
      rating: 5,
      comment: 'I\'ve been training at Fitness Hub for six months, and the results are amazing. The programs are challenging yet rewarding, and the community is fantastic.',
      likes: 12,
      dislikes: 1,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvscEwGqI0sfTqm4823Qs7GX_-53JyttVuxHj0wy8RUPPpiftr1a7kqoYPldy5aJHth66rp13pXqBUjVAag4aETHutSY2c5_W7wGFha-Jn018gGx4gXm8Y62v9ySOo9snmDJvXFV3L9JgQbsT72RXe8gnIPMr-bNwUA3I6zBmQBt4dytk9auvq5tNtviBsqK2tBhLCGoeCVgRFW2wt1myBvNXMDEJuaU2UtWjZNEiZ5mYtDC3Wcvu--nmgwExu_H5m2SBqhNIYjvP5'
    }
  ];

  const StarIcon = () => (
    <div className="text-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
        <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z" />
      </svg>
    </div>
  );

  return (
    <>
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Success Stories</h2>
      <div className="flex flex-col gap-8 overflow-x-hidden bg-[#111714] p-4">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="flex flex-col gap-3 bg-[#111714]">
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{ backgroundImage: `url("${testimonial.avatar}")` }}
              />
              <div className="flex-1">
                <p className="text-white text-base font-medium leading-normal">{testimonial.name}</p>
                <p className="text-[#9eb7a8] text-sm font-normal leading-normal">{testimonial.time}</p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[...Array(testimonial.rating)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <p className="text-white text-base font-normal leading-normal">
              {testimonial.comment}
            </p>
            <div className="flex gap-9 text-[#9eb7a8]">
              <button className="flex items-center gap-2">
                <div className="text-inherit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z" />
                  </svg>
                </div>
                <p className="text-inherit">{testimonial.likes}</p>
              </button>
              <button className="flex items-center gap-2">
                <div className="text-inherit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z" />
                  </svg>
                </div>
                <p className="text-inherit">{testimonial.dislikes}</p>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
} 