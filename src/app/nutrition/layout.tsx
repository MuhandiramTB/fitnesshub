export default function NutritionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#111714]">
      {children}
    </div>
  );
} 