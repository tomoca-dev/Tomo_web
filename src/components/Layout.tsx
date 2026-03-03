import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { EnhancedGlobalBeans } from "./EnhancedGlobalBeans";

type PageIntensity = "default" | "heritage" | "purpose" | "collection";

interface LayoutProps {
  children: React.ReactNode;
  showGlobalBeans?: boolean;
  beanCount?: number;
  pageIntensity?: PageIntensity;
}

export function Layout({ 
  children, 
  showGlobalBeans = true, 
  beanCount,
  pageIntensity = "default" 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {showGlobalBeans && (
        <EnhancedGlobalBeans baseCount={beanCount} pageIntensity={pageIntensity} />
      )}
      <Navbar />
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
