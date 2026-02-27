import { Hero } from "@/components/Hero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ProductShowcase } from "@/components/ProductShowcase";
import { StorySection } from "@/components/StorySection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Layout } from "@/components/Layout";

const Index = () => {
  return (
    <Layout showGlobalBeans={false}>
      <Hero />
      <FeaturesSection />
      <ProductShowcase />
      <StorySection />
      <NewsletterSection />
    </Layout>
  );
};

export default Index;
