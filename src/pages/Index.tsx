import { Hero } from "@/components/Hero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ProductShowcase } from "@/components/ProductShowcase";
import { FeaturedProductAd } from "@/components/FeaturedProductAd";
import { StorySection } from "@/components/StorySection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Layout } from "@/components/Layout";

const Index = () => {
  return (
    <Layout showGlobalBeans={true} beanCount={10} pageIntensity="default">
      <Hero />
      <FeaturesSection />
      <ProductShowcase />
      <FeaturedProductAd />
      <StorySection />
      <NewsletterSection />
    </Layout>
  );
};

export default Index;
