import StoreNavbar from './components/StoreNavbar';
import StoreFooter from './components/StoreFooter';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#111714]">
      <StoreNavbar />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
    </div>
  );
} 