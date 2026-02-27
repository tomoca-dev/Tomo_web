import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import tomocaLogo from "@/assets/tomoca-logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, LogOut, Settings, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BeanDensityControl } from "@/components/BeanDensityControl";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Regions", href: "/regions" },
  { label: "Locations", href: "/locations" },
  { label: "Our Story", href: "/our-story" },
  { label: "Journal", href: "/blog" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, loading, signOut } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.warn("handleSignOut error:", err);
    } finally {
      setIsMobileMenuOpen(false);
      navigate("/login");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <nav className="container max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={tomocaLogo} alt="TOMOCA" className="h-8 md:h-10 w-auto" />
          <span className="text-lg md:text-xl font-display tracking-[0.2em] text-foreground uppercase">
            TOMOCA
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-sm transition-colors duration-200 relative group ${
                location.pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <BeanDensityControl />
          <ThemeToggle />

          {user && (
            <Button variant="ghost" size="icon" className="relative text-foreground" aria-label="Wishlist" asChild>
              <Link to="/wishlist">
                <Heart className="w-5 h-5" />
              </Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="relative text-foreground" aria-label="Shopping bag" asChild>
            <Link to="/cart" className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            </Link>
          </Button>

          {/* Auth / User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                <div className="px-3 py-2 text-sm">
                  <p className="font-medium truncate">{user.email}</p>
                  {/* Show admin label only after loading completes */}
                  {!loading && isAdmin && <p className="text-xs text-primary">Admin</p>}
                </div>

                <DropdownMenuSeparator />

                {/* Desktop admin link: render only after loading completes */}
                {!loading && isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen((s) => !s)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b border-border/50 overflow-hidden"
          >
            <div className="container px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                  <Link to={link.href} className="text-lg font-display text-foreground hover:text-primary transition-colors py-2 block" onClick={() => setIsMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {!user && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}>
                  <Link to="/login" className="text-lg font-display text-primary hover:text-primary/80 transition-colors py-2 block" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </motion.div>
              )}

              {/* Mobile admin link: only after loading completes */}
              {!loading && isAdmin && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: (navLinks.length + 1) * 0.05 }}>
                  <Link to="/admin" className="text-lg font-display text-foreground hover:text-primary transition-colors py-2 block" onClick={() => setIsMobileMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                </motion.div>
              )}

              {user && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: (navLinks.length + 2) * 0.05 }}>
                  <button onClick={handleSignOut} className="text-lg font-display text-destructive transition-colors py-2 text-left w-full">
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}