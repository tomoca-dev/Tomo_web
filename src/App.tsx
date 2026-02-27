import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { BeanDensityProvider } from "@/contexts/BeanDensityContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import ProductView from "./pages/ProductView";
import Blog from "./pages/Blog";
import Admin from "./pages/Admin";
import OurStory from "./pages/OurStory";
 import Wishlist from "./pages/Wishlist";
 import Locations from "./pages/Locations";
 import Regions from "./pages/Regions";
 import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="tomoca-theme">
      <BeanDensityProvider>
        <AuthProvider>
          <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductView />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<Blog />} />
                <Route path="/our-story" element={<OurStory />} />
                 <Route path="/wishlist" element={<Wishlist />} />
                 <Route path="/locations" element={<Locations />} />
                 <Route path="/regions" element={<Regions />} />
                 <Route path="/admin" element={<Admin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
        </AuthProvider>
      </BeanDensityProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
