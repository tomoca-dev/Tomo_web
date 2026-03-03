import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";
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

const SECTION_HERO: Record<PageIntensity, { image: string; kicker: string }> = {
  heritage: {
    image: "/our-story/ethiopian-heritage.jpg",
    kicker: "From the birthplace of coffee",
  },
  purpose: {
    image: "/our-story/our-purpose.jpg",
    kicker: "A legacy built with care",
  },
  collection: {
    image: "/our-story/our-collection.jpg",
    kicker: "Curated experiences, one cup at a time",
  },
};

const SECTION_IMAGE_FOCUS: Record<PageIntensity, string> = {
  // Portrait images: keep faces higher in frame for a nicer "hero" crop.
  heritage: "50% 20%",
  purpose: "50% 20%",
  collection: "50% 25%",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function normalizeSectionKey(section: string): PageIntensity {
  const s = (section || "").toLowerCase().trim();
  if (s === "heritage" || s.includes("heritage")) return "heritage";
  if (s === "purpose" || s.includes("purpose")) return "purpose";
  if (s === "collection" || s.includes("collection")) return "collection";
  return "heritage";
}

function Lightbox({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: StoryMedia | null;
}) {
  if (!open || !item) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden bg-background border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 border border-border hover:bg-background transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="w-full bg-card">
          {item.media_type === "video" ? (
            <video
              src={item.media_url}
              poster={item.thumbnail_url || undefined}
              controls
              playsInline
              className="w-full max-h-[80vh] object-contain"
            />
          ) : item.media_type === "embed" ? (
            <div className="aspect-video">
              <iframe
                src={item.media_url}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <img
              src={item.media_url}
              alt={item.title}
              className="w-full max-h-[80vh] object-contain"
            />
          )}
        </div>

        <div className="p-5">
          <h3 className="font-display text-xl">{item.title}</h3>
          {item.description && (
            <p className="text-muted-foreground mt-1">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MediaItem({ item, onOpen }: { item: StoryMedia; onOpen: (item: StoryMedia) => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  if (item.media_type === "embed") {
    // YouTube/Vimeo embed
    return (
      <div className="aspect-video rounded-2xl overflow-hidden bg-card border border-border">
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
      <div
        className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border group cursor-pointer"
        onDoubleClick={() => onOpen(item)}
      >
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
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
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

        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(item);
            }}
          >
            Open
          </Button>
        </div>
      </div>
    );
  }

  // Image
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="aspect-video rounded-2xl overflow-hidden bg-card border border-border w-full text-left group"
    >
      <img
        src={item.media_url}
        alt={item.title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
    </button>
  );
}

export default function OurStory() {
  const [media, setMedia] = useState<StoryMedia[]>([]);
  const [activeSection, setActiveSection] = useState<PageIntensity>("heritage");
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<StoryMedia | null>(null);

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
    media.filter((m) => normalizeSectionKey(m.section) === sectionId);

  const sectionMedia = useMemo(
    () => getMediaForSection(activeSection),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [media, activeSection]
  );

  const openLightbox = (item: StoryMedia) => {
    setLightboxItem(item);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    // delay clearing to avoid flicker when closing animation (if added later)
    setTimeout(() => setLightboxItem(null), 50);
  };

  return (
    <Layout showGlobalBeans={true} beanCount={20} pageIntensity={activeSection}>
      <section className="pt-28 pb-20 px-4">
        <div className="container mx-auto">
          <Lightbox open={lightboxOpen} onClose={closeLightbox} item={lightboxItem} />
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
                  {/* Section hero */}
                  <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="lg:col-span-5 flex flex-col justify-center"
                    >
                      <p className="text-sm tracking-widest uppercase text-primary/80 mb-3">
                        {SECTION_HERO[section.id].kicker}
                      </p>
                      <h2 className="font-display text-3xl md:text-5xl mb-4">
                        {section.title}
                      </h2>
                      <p className="text-lg text-muted-foreground">{section.subtitle}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="lg:col-span-7"
                    >
                      <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-2xl">
                        {/* Landing-style treatment: blurred image wash + texture + glow */}
                        <div className="absolute inset-0">
                          <img
                            src={SECTION_HERO[section.id].image}
                            alt=""
                            aria-hidden="true"
                            className="w-full h-full object-cover scale-110 blur-2xl opacity-40"
                            style={{ objectPosition: SECTION_IMAGE_FOCUS[section.id] }}
                          />
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--background))_70%)]" />
                          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
     style={{
       backgroundImage: "radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)",
       backgroundSize: "4px 4px"
     }}
/>
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-primary/10 rounded-full blur-[120px]" />
                        </div>

                        {/* Foreground portrait (no awkward crop) */}
                        <div className="relative p-6 md:p-8 lg:p-10 flex items-center justify-center">
                          <div className="w-full max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden border border-border/60 bg-background/40 shadow-xl">
                            <img
                              src={SECTION_HERO[section.id].image}
                              alt={section.title}
                              className="w-full h-full object-cover"
                              style={{ objectPosition: SECTION_IMAGE_FOCUS[section.id] }}
                              loading="lazy"
                            />
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/15 to-transparent" />

                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Featured</p>
                              <p className="font-display text-xl md:text-2xl">{section.title}</p>
                            </div>
                            <Button
                              variant="secondary"
                              className="backdrop-blur-sm"
                              onClick={() => {
                                const el = document.getElementById(`story-gallery-${section.id}`);
                                el?.scrollIntoView({ behavior: "smooth", block: "start" });
                              }}
                            >
                              Explore
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div id={`story-gallery-${section.id}`} />

                  {loading ? (
                    <div className="flex justify-center py-20">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : sectionMedia.length > 0 ? (
                    <div>
                      <div className="flex items-end justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-display text-2xl">Gallery</h3>
                          <p className="text-muted-foreground">
                            Photos & videos curated for this chapter.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {sectionMedia.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.06 * index,
                              duration: 0.5,
                              ease: [0.22, 0.61, 0.36, 1],
                            }}
                            className={cn(index === 0 && "lg:col-span-2")}
                          >
                            <MediaItem item={item} onOpen={openLightbox} />
                            <div className="mt-3">
                              <h3 className="font-display text-lg md:text-xl">{item.title}</h3>
                              {item.description && (
                                <p className="text-muted-foreground mt-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : null}

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
