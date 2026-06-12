import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { BeanDensityProvider } from "@/contexts/BeanDensityContext";
import { CartProvider } from "@/contexts/CartContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

// Heritage Brew UI pages are the primary public-facing UI.
import HeritageHome from "./pages/heritage/Home";
import HeritageAbout from "./pages/heritage/About";
import HeritageMenu from "./pages/heritage/Menu";
import HeritageShop from "./pages/heritage/Shop";
import HeritageLocations from "./pages/heritage/Locations";
import HeritageOrder from "./pages/heritage/Order";
import HeritageWholesale from "./pages/heritage/Wholesale";
import HeritageContact from "./pages/heritage/Contact";
import HeritageExperience from "./pages/heritage/Experience";
import HeritageStories from "./pages/heritage/Stories";
import HeritageEvents from "./pages/heritage/Events";
import HeritageFAQ from "./pages/heritage/FAQ";
import HeritagePolicies from "./pages/heritage/Policies";
import HeritageCareers from "./pages/heritage/Careers";
import HeritageRoastery from "./pages/heritage/Roastery";
import HeritageGallery from "./pages/heritage/Gallery";
import HeritagePromotions from "./pages/heritage/Promotions";
import HeritageLoyalty from "./pages/heritage/Loyalty";
import HeritagePress from "./pages/heritage/Press";
import HeritageReviews from "./pages/heritage/Reviews";
import HeritageMerchandise from "./pages/heritage/Merchandise";
import HeritagePortfolio from "./pages/heritage/ProductPortfolio";
import HeritageJournal from "./pages/heritage/Journal";
import HeritageJournalPost from "./pages/heritage/JournalPost";
import HeritageHeritage from "./pages/heritage/Heritage";

// Working system pages retained from Tomo_web-main.
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProductView from "./pages/ProductView";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import OurStory from "./pages/OurStory";
import Wishlist from "./pages/Wishlist";
import Regions from "./pages/Regions";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="tomoca-theme">
      <BeanDensityProvider>
        <AuthProvider>
          <CartProvider>
            <CurrencyProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Heritage Brew public UI */}
                    <Route path="/" element={<HeritageHome />} />
                    <Route path="/about" element={<HeritageAbout />} />
                    <Route path="/menu" element={<HeritageMenu />} />
                    <Route path="/shop" element={<HeritageShop />} />
                    <Route path="/locations" element={<HeritageLocations />} />
                    <Route path="/order" element={<HeritageOrder />} />
                    <Route path="/wholesale" element={<HeritageWholesale />} />
                    <Route path="/contact" element={<HeritageContact />} />
                    <Route path="/experience" element={<HeritageExperience />} />
                    <Route path="/stories" element={<HeritageStories />} />
                    <Route path="/events" element={<HeritageEvents />} />
                    <Route path="/faq" element={<HeritageFAQ />} />
                    <Route path="/policies" element={<HeritagePolicies />} />
                    <Route path="/careers" element={<HeritageCareers />} />
                    <Route path="/roastery" element={<HeritageRoastery />} />
                    <Route path="/gallery" element={<HeritageGallery />} />
                    <Route path="/promotions" element={<HeritagePromotions />} />
                    <Route path="/loyalty" element={<HeritageLoyalty />} />
                    <Route path="/press" element={<HeritagePress />} />
                    <Route path="/reviews" element={<HeritageReviews />} />
                    <Route path="/merchandise" element={<HeritageMerchandise />} />
                    <Route path="/portfolio" element={<HeritagePortfolio />} />
                    <Route path="/journal" element={<HeritageJournal />} />
                    <Route path="/journal/:id" element={<HeritageJournalPost />} />
                    <Route path="/heritage" element={<HeritageHeritage />} />

                    {/* Existing working system routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/product/:id" element={<ProductView />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/our-story" element={<OurStory />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/regions" element={<Regions />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </CurrencyProvider>
          </CartProvider>
        </AuthProvider>
      </BeanDensityProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
