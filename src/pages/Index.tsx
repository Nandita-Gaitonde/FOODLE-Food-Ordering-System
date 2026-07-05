import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryList from "@/components/CategoryList";
import FeaturedDishes from "@/components/FeaturedDishes";
import SpecialOffers from "@/components/SpecialOffers";
import HotAndFresh from "@/components/HotAndFresh";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <CategoryList />
      <FeaturedDishes />
      <SpecialOffers />
      <HotAndFresh />
      <Footer />
    </div>
  );
};

export default Index;
