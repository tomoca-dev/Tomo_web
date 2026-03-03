import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Clock, Star } from "lucide-react";
import { SectionBeans } from "@/components/SectionBeans";
import { LocationMap } from "@/components/LocationMap";

interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string | null;
  country: string;
  phone: string | null;
  is_flagship: boolean | null;
  opening_hours: Record<string, string>;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
}

export default function Locations() {
  const [locations, setLocations] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from("store_locations")
      .select("*")
      .eq("is_active", true)
      .order("is_flagship", { ascending: false });

    if (!error && data) {
      setLocations(data as StoreLocation[]);
    }
    setLoading(false);
  };

  const getTodayHours = (hours: Record<string, string>) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    return hours[today] || 'Hours not available';
  };

  return (
    <Layout showGlobalBeans={true} beanCount={10}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <SectionBeans pattern="scattered" count={6} className="opacity-30" />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary mb-4">
              <span className="w-8 h-px bg-primary" />
              Find Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
              Our <span className="text-gradient-gold">Locations</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Visit us at one of our coffee houses across Ethiopia. 
              Experience the authentic taste of Ethiopian coffee in person.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      {!loading && locations.some(l => l.latitude && l.longitude) && (
        <section className="px-4 pb-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LocationMap locations={locations} />
            </motion.div>
          </div>
        </section>
      )}

      {/* Locations Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card/30 rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-20">
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display text-2xl mb-2">No locations found</h3>
              <p className="text-muted-foreground">Check back soon for new store openings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-glow h-full flex flex-col">
                    {/* Image/Header */}
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-bean-dark/40 relative overflow-hidden">
                      {location.image_url ? (
                        <img 
                          src={location.image_url} 
                          alt={location.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-primary/40" />
                        </div>
                      )}
                      
                      {location.is_flagship && (
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Flagship
                        </div>
                      )}
                    </div>

                    {/* Location Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-display text-xl mb-2 group-hover:text-primary transition-colors">
                        {location.name}
                      </h3>
                      
                      <div className="space-y-3 text-sm text-muted-foreground flex-1">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                          <div>
                            <p>{location.address}</p>
                            <p>{location.city}{location.region && `, ${location.region}`}</p>
                          </div>
                        </div>
                        
                        {location.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-primary shrink-0" />
                            <a href={`tel:${location.phone}`} className="hover:text-primary transition-colors">
                              {location.phone}
                            </a>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-primary shrink-0" />
                          <span>Today: {getTodayHours(location.opening_hours)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Can't Visit? <span className="text-gradient-gold">We Ship!</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Order our premium Ethiopian coffee online and have it delivered fresh to your doorstep.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
