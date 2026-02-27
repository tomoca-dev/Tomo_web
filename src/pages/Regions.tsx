 import { useState, useEffect } from "react";
 import { motion } from "framer-motion";
 import { Layout } from "@/components/Layout";
 import { supabase } from "@/integrations/supabase/client";
 import { MapPin, Mountain, Calendar, Coffee } from "lucide-react";
 import { SectionBeans } from "@/components/SectionBeans";
 import { Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 
 interface CoffeeRegion {
   id: string;
   name: string;
   display_name: string;
   description: string | null;
   altitude_range: string | null;
   flavor_notes: string[] | null;
   harvest_season: string | null;
   image_url: string | null;
   display_order: number | null;
 }
 
 export default function Regions() {
   const [regions, setRegions] = useState<CoffeeRegion[]>([]);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     fetchRegions();
   }, []);
 
   const fetchRegions = async () => {
     const { data, error } = await supabase
       .from("coffee_regions")
       .select("*")
       .eq("is_active", true)
       .order("display_order", { ascending: true });
 
     if (!error && data) {
       setRegions(data as CoffeeRegion[]);
     }
     setLoading(false);
   };
 
   const regionColors = [
     "from-amber-900/80 to-amber-950",
     "from-stone-800/80 to-stone-950",
     "from-orange-900/80 to-orange-950",
     "from-yellow-900/80 to-yellow-950",
     "from-red-900/80 to-red-950",
     "from-emerald-900/80 to-emerald-950",
     "from-rose-900/80 to-rose-950",
     "from-indigo-900/80 to-indigo-950",
   ];
 
   return (
     <Layout showGlobalBeans={true} beanCount={14} pageIntensity="collection">
       {/* Hero Section */}
       <section className="relative pt-32 pb-20 px-4 overflow-hidden">
         <div className="absolute inset-0 hero-gradient opacity-50" />
         <SectionBeans pattern="arc" count={10} className="opacity-30" />
         
         <div className="container mx-auto relative z-10">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="text-center max-w-3xl mx-auto"
           >
             <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary mb-4">
               <span className="w-8 h-px bg-primary" />
               Ethiopian Origins
             </span>
             <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
               Coffee <span className="text-gradient-gold">Regions</span>
             </h1>
             <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
               Ethiopia is the birthplace of coffee, home to incredible biodiversity 
               and distinct terroirs that produce the world's most complex and flavorful beans.
             </p>
           </motion.div>
         </div>
       </section>
 
       {/* Regions Grid */}
       <section className="py-16 px-4">
         <div className="container mx-auto max-w-6xl">
           {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="bg-card/30 rounded-2xl h-80 animate-pulse" />
               ))}
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {regions.map((region, index) => (
                 <motion.article
                   key={region.id}
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-50px" }}
                   transition={{ duration: 0.6, delay: index * 0.1 }}
                   className="group"
                 >
                   <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-glow">
                     {/* Header with gradient */}
                     <div className={`aspect-[3/1] bg-gradient-to-br ${regionColors[index % regionColors.length]} relative overflow-hidden`}>
                       {region.image_url ? (
                         <img 
                           src={region.image_url} 
                           alt={region.display_name}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                         />
                       ) : (
                         <div className="absolute inset-0 flex items-center justify-center">
                           <div className="text-center text-cream/80">
                             <MapPin className="w-8 h-8 mx-auto mb-2 opacity-60" />
                             <span className="font-display text-2xl">{region.display_name}</span>
                           </div>
                         </div>
                       )}
                       
                       {/* Overlay gradient */}
                       <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                     </div>
 
                     {/* Content */}
                     <div className="p-6">
                       <h3 className="font-display text-2xl mb-3 group-hover:text-primary transition-colors">
                         {region.display_name}
                       </h3>
                       
                       <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                         {region.description}
                       </p>
 
                       {/* Meta info */}
                       <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                         {region.altitude_range && (
                           <div className="flex items-center gap-2 text-muted-foreground">
                             <Mountain className="w-4 h-4 text-primary" />
                             <span>{region.altitude_range}</span>
                           </div>
                         )}
                         {region.harvest_season && (
                           <div className="flex items-center gap-2 text-muted-foreground">
                             <Calendar className="w-4 h-4 text-primary" />
                             <span>{region.harvest_season}</span>
                           </div>
                         )}
                       </div>
 
                       {/* Flavor notes */}
                       {region.flavor_notes && region.flavor_notes.length > 0 && (
                         <div className="flex flex-wrap gap-2">
                           {region.flavor_notes.map((note) => (
                             <span 
                               key={note}
                               className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                             >
                               {note}
                             </span>
                           ))}
                         </div>
                       )}
                     </div>
                   </div>
                 </motion.article>
               ))}
             </div>
           )}
         </div>
       </section>
 
       {/* Shop CTA */}
       <section className="py-20 px-4 bg-secondary/30">
         <div className="container mx-auto max-w-2xl text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
           >
             <Coffee className="w-12 h-12 mx-auto text-primary mb-4" />
             <h2 className="font-display text-3xl md:text-4xl mb-4">
               Taste the <span className="text-gradient-gold">Difference</span>
             </h2>
             <p className="text-muted-foreground mb-8">
               Experience the unique flavors of each Ethiopian coffee region. 
               Order now and discover your new favorite origin.
             </p>
             <Link to="/shop">
               <Button size="lg" className="font-medium">
                 Shop by Origin
               </Button>
             </Link>
           </motion.div>
         </div>
       </section>
     </Layout>
   );
 }