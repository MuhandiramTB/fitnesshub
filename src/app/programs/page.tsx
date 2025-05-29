'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const programs = [
  {
    title: "Strength Training",
    description: "Build muscle and increase your overall strength with our comprehensive strength training program.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000",
    duration: "8 weeks",
    level: "Beginner to Advanced",
    features: [
      "Personalized workout plans",
      "Form correction sessions",
      "Progress tracking",
      "Nutrition guidance"
    ]
  },
  {
    title: "HIIT & Cardio",
    description: "High-intensity interval training to boost your metabolism and improve cardiovascular health.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000",
    duration: "6 weeks",
    level: "Intermediate",
    features: [
      "Dynamic workout routines",
      "Heart rate monitoring",
      "Recovery protocols",
      "Group sessions"
    ]
  },
  {
    title: "Yoga & Flexibility",
    description: "Enhance your flexibility, balance, and mental well-being through our yoga program.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000",
    duration: "12 weeks",
    level: "All Levels",
    features: [
      "Multiple yoga styles",
      "Meditation sessions",
      "Breathing techniques",
      "Flexibility assessment"
    ]
  },
  {
    title: "Weight Loss",
    description: "Comprehensive program designed to help you achieve sustainable weight loss goals.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000",
    duration: "10 weeks",
    level: "All Levels",
    features: [
      "Customized meal plans",
      "Workout routines",
      "Progress tracking",
      "Weekly check-ins"
    ]
  },
  {
    title: "Sports Conditioning",
    description: "Improve your athletic performance with sport-specific training and conditioning.",
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1000",
    duration: "8 weeks",
    level: "Intermediate to Advanced",
    features: [
      "Sport-specific drills",
      "Agility training",
      "Strength conditioning",
      "Performance analysis"
    ]
  },
  {
    title: "Senior Fitness",
    description: "Gentle yet effective exercises designed specifically for older adults.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000",
    duration: "Ongoing",
    level: "All Levels",
    features: [
      "Low-impact exercises",
      "Balance training",
      "Joint-friendly workouts",
      "Social activities"
    ]
  }
];

export default function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#111714]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative py-20 px-4 md:px-40">
        <div className="max-w-[960px] mx-auto">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-6">
            Our Fitness Programs
          </h1>
          <p className="text-[#9eb7a8] text-lg md:text-xl mb-8 max-w-2xl">
            Choose from our diverse range of programs designed to help you achieve your fitness goals, whether you're just starting out or looking to take your training to the next level.
          </p>
        </div>
      </div>
      <div className="px-4 md:px-40 pb-20">
        <div className="max-w-[960px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-[#29382f] rounded-xl overflow-hidden hover:border hover:border-[#38e07b]/20 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProgram(selectedProgram === program.title ? null : program.title)}
              >
                <div
                  className="w-full h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${program.image})` }}
                />
                <div className="p-6">
                  <h3 className="text-white text-xl font-bold mb-2">{program.title}</h3>
                  <p className="text-[#9eb7a8] text-sm mb-4">{program.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[#38e07b] text-sm font-medium">{program.duration}</span>
                    <span className="text-[#9eb7a8] text-sm">•</span>
                    <span className="text-[#9eb7a8] text-sm">{program.level}</span>
                  </div>

                  {selectedProgram === program.title && (
                    <div className="mt-4 pt-4 border-t border-[#38e07b]/20">
                      <h4 className="text-white text-sm font-semibold mb-3">Program Features:</h4>
                      <ul className="space-y-2">
                        {program.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg
                              className="w-5 h-5 text-[#38e07b] mr-2 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-[#9eb7a8] text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button className="w-full mt-4 bg-[#38e07b] text-black py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#2bc665] transition-colors">
                        Join Program
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      

      <Footer />
    </div>
  );
}