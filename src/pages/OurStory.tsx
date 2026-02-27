import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryMedia {
  id: string;
  title: string;
  description: string | null;
  media_type: "image" | "video" | "embed";
  media_url: string;
  thumbnail_url: string | null;
  section: string;
  display_order: number;
}

type PageIntensity = "heritage" | "purpose" | "collection";

const sections: { id: PageIntensity; title: string; subtitle: string }[] = [
  {
    id: "heritage",
    title: "Ethiopian Heritage",
    subtitle: "Where coffee was born, a tradition continues",
  },
  {
    id: "purpose",
    title: "Our Purpose",
    subtitle: "Connecting farmers to your cup with care",
  },
  {
    id: "collection",
    title: "Our Collection",
    subtitle: "Curated beans from the highlands",
  },
];

function MediaItem({ item }: { item: StoryMedia }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  if (item.media_type === "embed") {
    // YouTube/Vimeo embed
    return (
      <div className="aspect-video rounded-2xl overflow-hidden bg-card">
        <iframe
          src={item.media_url}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  if (item.media_type === "video") {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-card group">
        <video
          src={item.media_url}
          poster={item.thumbnail_url || undefined}
          muted={isMuted}
          loop
          playsInline
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={(e) => {
            const video = e.currentTarget;
            if (video.paused) video.play();
            else video.pause();
          }}
        />
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              const video = e.currentTarget.parentElement?.previousElementSibling as HTMLVideoElement;
              if (video) {
                if (video.paused) video.play();
                else video.pause();
              }
            }}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    );
  }

  // Image
  return (
    <div className="aspect-video rounded-2xl overflow-hidden bg-card">
      <img
        src={item.media_url}
        alt={item.title}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
      />
    </div>
  );
}

export default function OurStory() {
  const [media, setMedia] = useState<StoryMedia[]>([]);
  const [activeSection, setActiveSection] = useState<PageIntensity>("heritage");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const { data, error } = await supabase
      .from("story_media")
      .select("*")
      .eq("is_published", true)
      .order("display_order");

    if (!error && data) {
      setMedia(data as StoryMedia[]);
    }
    setLoading(false);
  };

  const getMediaForSection = (sectionId: string) =>
    media.filter((m) => m.section === sectionId);

  return (
    <Layout showGlobalBeans={true} beanCount={20} pageIntensity={activeSection}>
      <section className="pt-28 pb-20 px-4">
        <div className="container mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            className="text-center mb-20"
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-6">
              Our Story
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From the birthplace of coffee to your cup, we honor a tradition
              that spans centuries and continents.
            </p>
          </motion.div>

          {/* Section Navigation */}
          <div className="flex justify-center gap-4 mb-16 flex-wrap">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/50 hover:bg-card text-foreground"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Active Section Content */}
          {sections.map((section) => (
            <motion.div
              key={section.id}
              initial={false}
              animate={{
                opacity: activeSection === section.id ? 1 : 0,
                height: activeSection === section.id ? "auto" : 0,
                overflow: "hidden",
              }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {activeSection === section.id && (
                <div className="space-y-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-12"
                  >
                    <h2 className="font-display text-3xl md:text-5xl mb-4">
                      {section.title}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {section.subtitle}
                    </p>
                  </motion.div>

                  {loading ? (
                    <div className="flex justify-center py-20">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : getMediaForSection(section.id).length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-8">
                      {getMediaForSection(section.id).map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.1 * index,
                            duration: 0.6,
                            ease: [0.22, 0.61, 0.36, 1],
                          }}
                        >
                          <MediaItem item={item} />
                          <div className="mt-4">
                            <h3 className="font-display text-xl">{item.title}</h3>
                            {item.description && (
                              <p className="text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-card/30 rounded-3xl border border-border">
                      <p className="text-muted-foreground">
                        No media added yet for this section.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Admins can upload content in the dashboard.
                      </p>
                    </div>
                  )}

                  {/* Section-specific text content */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-3xl mx-auto text-center mt-16"
                  >
                    {section.id === "heritage" && (
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        Ethiopia, the birthplace of coffee, has nurtured this
                        precious crop for over a millennium. In the misty
                        highlands of Yirgacheffe and Sidamo, our partner farmers
                        tend to heirloom varietals using methods passed down
                        through generations. Each bean carries the essence of
                        volcanic soil, morning mist, and centuries of tradition.
                      </p>
                    )}
                    {section.id === "purpose" && (
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        We believe great coffee should uplift everyone it
                        touches—from the farmers who grow it to the communities
                        they support. Through direct trade partnerships, we ensure
                        fair compensation while preserving traditional farming
                        practices. Every cup you enjoy contributes to sustainable
                        livelihoods in Ethiopia's coffee-growing regions.
                      </p>
                    )}
                    {section.id === "collection" && (
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        Our collection represents the finest single-origin
                        offerings from Ethiopia's diverse growing regions. From
                        the bright, floral notes of washed Yirgacheffe to the
                        wild, fruity complexity of natural-processed Sidamo, each
                        roast is crafted to highlight its unique terroir. We roast
                        in small batches to ensure peak freshness.
                      </p>
                    )}
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
