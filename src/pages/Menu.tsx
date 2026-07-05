import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuCard from "@/components/MenuCard";
import { categories, getItemsByCategory } from "@/data/menuData";
import { Search, UtensilsCrossed } from "lucide-react"; // Added UtensilsCrossed

const Menu = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync category from URL on mount or URL change
  useEffect(() => {
    if (categoryFromUrl) {
      // Map URL slugs to category IDs
      const categoryMap: Record<string, string> = {
        "breakfast": "breakfast",
        "dosa": "dosa",
        "idli": "breakfast", // Map idli to breakfast category
        "meals": "meals",
        "snacks": "snacks",
        "beverages": "beverages",
        "desserts": "desserts",
      };
      const mappedCategory = categoryMap[categoryFromUrl] || "all";
      setActiveCategory(mappedCategory);
    }
  }, [categoryFromUrl]);

  const filteredItems = getItemsByCategory(activeCategory).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Header - Updated for Even Color & More Life */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Fresh & Authentic
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary flex items-center justify-center gap-3">
              Our Menu <UtensilsCrossed className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of authentic South Indian delicacies, prepared fresh every day.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
                }`}
              >
                <span>{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <MenuCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-2xl text-muted-foreground">No items found</p>
              <p className="text-muted-foreground mt-2">Try a different search or category</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;