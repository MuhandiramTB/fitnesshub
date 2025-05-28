'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface MealPlan {
  title: string;
  description: string;
  image: string;
  type: string;
}

export default function NutritionPage() {
  const [selectedDiet, setSelectedDiet] = useState('all');
  
  const meals: MealPlan[] = [
    {
      title: "Coconut Milk Rice with Lentil Curry",
      description: "A traditional Sri Lankan breakfast that's both filling and nutritious.",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=2574&auto=format&fit=crop",
      type: "breakfast"
    },
    {
      title: "Mixed Vegetable Curry with Brown Rice",
      description: "A balanced meal with a variety of vegetables and whole grains.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2570&auto=format&fit=crop",
      type: "lunch"
    },
    {
      title: "Fish Ambul Thiyal with Steamed Vegetables",
      description: "A flavorful fish curry with a tangy twist, served with steamed vegetables.",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2574&auto=format&fit=crop",
      type: "dinner"
    },
    {
      title: "Fruit Salad with Yogurt",
      description: "A refreshing and light snack with local fruits and yogurt.",
      image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=2570&auto=format&fit=crop",
      type: "snack"
    }
  ];

  const dietaryPreferences = [
    { id: 'all', label: 'All' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'non-vegetarian', label: 'Non-Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'pescatarian', label: 'Pescatarian' }
  ];

  const mealTypes = [
    { id: 'all', label: 'All Meals' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snack', label: 'Snacks' }
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111714] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="px-4 md:px-40 flex flex-1 justify-center py-20">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <h1 className="text-white text-4xl font-bold mb-4">Personalized Nutrition Plan</h1>
            <p className="text-[#9eb7a8] text-lg mb-8">Based on your preferences, here's a meal plan tailored for you.</p>

            {/* Dietary Preferences */}
            <div className="mb-8">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Dietary Preferences</h2>
              <div className="flex flex-wrap gap-3">
                {dietaryPreferences.map((diet) => (
                  <button
                    key={diet.id}
                    onClick={() => setSelectedDiet(diet.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedDiet === diet.id
                        ? 'bg-[#38e07b] text-black'
                        : 'bg-[#29382f] text-white hover:bg-[#38e07b] hover:text-black'
                    }`}
                  >
                    {diet.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Types */}
            <div className="mb-8">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Meal Types</h2>
              <div className="flex flex-wrap gap-3">
                {mealTypes.map((type) => (
                  <button
                    key={type.id}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-[#29382f] text-white hover:bg-[#38e07b] hover:text-black transition-colors"
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meals.map((meal, index) => (
                <div
                  key={index}
                  className="bg-[#29382f] rounded-lg overflow-hidden border border-[#38e07b]/20 hover:border-[#38e07b] transition-all duration-300"
                >
                  <div
                    className="w-full h-48 bg-center bg-cover"
                    style={{ backgroundImage: `url(${meal.image})` }}
                  />
                  <div className="p-6">
                    <h3 className="text-white text-xl font-bold mb-2">{meal.title}</h3>
                    <p className="text-[#9eb7a8] text-sm">{meal.description}</p>
                    <div className="mt-4">
                      <span className="inline-block bg-[#38e07b]/20 text-[#38e07b] px-3 py-1 rounded-full text-sm">
                        {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Generate New Plan Button */}
            <div className="mt-8 flex justify-center">
              <button className="bg-[#38e07b] text-black px-8 py-3 rounded-full text-lg font-medium hover:bg-[#2bc665] transition-colors">
                Generate New Plan
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 