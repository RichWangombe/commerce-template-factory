
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOption, setSortOption] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Mock category data
  const categoryData = {
    smartphones: {
      name: "Smartphones",
      description: "Latest smartphones with cutting-edge technology",
      image: "https://api.iconify.design/lucide:smartphone.svg?color=%23000000",
    },
    laptops: {
      name: "Laptops",
      description: "Powerful laptops for work and play",
      image: "https://api.iconify.design/lucide:laptop.svg?color=%23000000",
    },
    wearables: {
      name: "Wearables",
      description: "Smart wearables to enhance your lifestyle",
      image: "https://api.iconify.design/lucide:watch.svg?color=%23000000",
    },
    accessories: {
      name: "Accessories",
      description: "Essential accessories for your devices",
      image: "https://api.iconify.design/lucide:headphones.svg?color=%23000000",
    },
    gaming: {
      name: "Gaming",
      description: "Gaming gear for the ultimate experience",
      image: "https://api.iconify.design/lucide:gamepad-2.svg?color=%23000000",
    },
  }[categoryId || "smartphones"];

  // Mock products data based on category
  const products = [
    {
      id: 1,
      name: "Smartphone X Pro",
      price: 899,
      image: "/lovable-uploads/6b752309-063d-437b-b887-e07e2232e3ba.png",
      category: "Smartphone",
      isNew: true,
    },
    {
      id: 2,
      name: "Smartphone X",
      price: 799,
      image: "/lovable-uploads/6b752309-063d-437b-b887-e07e2232e3ba.png",
      category: "Smartphone",
      discount: 10,
    },
    {
      id: 3,
      name: "Smartphone Y",
      price: 699,
      image: "/lovable-uploads/6b752309-063d-437b-b887-e07e2232e3ba.png",
      category: "Smartphone",
    },
    {
      id: 4,
      name: "Smartphone Z",
      price: 599,
      image: "/lovable-uploads/6b752309-063d-437b-b887-e07e2232e3ba.png",
      category: "Smartphone",
    },
    {
      id: 5,
      name: "Smartwatch Pro",
      price: 299,
      image: "/lovable-uploads/f306dd50-931c-4e73-b66d-61b3383f1151.png",
      category: "Wearable",
      isNew: true,
    },
    {
      id: 6,
      name: "Wireless Earbuds",
      price: 149,
      image: "/lovable-uploads/5724322a-7599-465b-8abc-a56c59781885.png",
      category: "Audio",
      discount: 15,
    },
  ];

  // Filter options
  const filterGroups = [
    {
      name: "Brand",
      options: ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"],
    },
    {
      name: "Price",
      isPrice: true,
    },
    {
      name: "Features",
      options: ["5G", "Wireless Charging", "Fast Charging", "Water Resistant", "Dual SIM"],
    },
    {
      name: "Storage",
      options: ["64GB", "128GB", "256GB", "512GB", "1TB"],
    },
    {
      name: "Color",
      options: ["Black", "White", "Blue", "Red", "Green"],
    },
  ];

  // Sort options
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Customer Rating" },
  ];

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setIsLoaded(true);
    }, 200);
  }, []);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setPriceRange([0, 1000]);
  };

  return (
    <div className={`flex min-h-screen flex-col bg-white ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      <Navbar />
      <main className="flex-1">
        {/* Category Header */}
        <section className="bg-neutral-50 py-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <Link to="/" className="mb-4 inline-flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Home
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <img src={categoryData?.image} alt={categoryData?.name} className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold md:text-3xl">{categoryData?.name}</h1>
                    <p className="mt-1 text-neutral-600">{categoryData?.description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center md:mt-0">
                <div className="relative ml-auto md:ml-0">
                  <select
                    className="appearance-none rounded-full border border-neutral-200 bg-white px-4 py-2 pr-8 text-sm font-medium focus:border-neutral-300 focus:outline-none"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 md:hidden"
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                >
                  <SlidersHorizontal className="mr-1 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filters Sidebar - Desktop */}
            <div className={`hidden w-full lg:block lg:w-1/4`}>
              <div className="sticky top-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  {activeFilters.length > 0 && (
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={clearFilters}
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {filterGroups.map((group) => (
                  <div key={group.name} className="space-y-3">
                    <h3 className="text-sm font-medium">{group.name}</h3>
                    
                    {group.isPrice ? (
                      <div className="space-y-4 pt-1">
                        <Slider
                          defaultValue={[0, 1000]}
                          max={1000}
                          step={10}
                          value={priceRange}
                          onValueChange={handlePriceChange}
                          className="py-2"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-600">
                            ${priceRange[0]}
                          </span>
                          <span className="text-sm text-neutral-600">
                            ${priceRange[1]}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {group.options?.map((option) => (
                          <div key={option} className="flex items-center">
                            <Checkbox
                              id={`filter-${group.name}-${option}`}
                              checked={activeFilters.includes(option)}
                              onCheckedChange={() => toggleFilter(option)}
                              className="h-4 w-4 rounded-sm border-neutral-300"
                            />
                            <label
                              htmlFor={`filter-${group.name}-${option}`}
                              className="ml-2 text-sm text-neutral-700"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Filters - Expandable */}
            <div className={cn(
              "fixed inset-0 z-40 transform overflow-auto bg-white transition-all duration-300 ease-in-out lg:hidden",
              mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
            )}>
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white p-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 space-y-6">
                {activeFilters.length > 0 && (
                  <button
                    className="w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-neutral-50"
                    onClick={clearFilters}
                  >
                    Clear all filters
                  </button>
                )}

                {filterGroups.map((group) => (
                  <div key={group.name} className="space-y-3">
                    <h3 className="text-sm font-medium">{group.name}</h3>
                    
                    {group.isPrice ? (
                      <div className="space-y-4 pt-1">
                        <Slider
                          defaultValue={[0, 1000]}
                          max={1000}
                          step={10}
                          value={priceRange}
                          onValueChange={handlePriceChange}
                          className="py-2"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-600">
                            ${priceRange[0]}
                          </span>
                          <span className="text-sm text-neutral-600">
                            ${priceRange[1]}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {group.options?.map((option) => (
                          <div key={option} className="flex items-center">
                            <Checkbox
                              id={`filter-mobile-${group.name}-${option}`}
                              checked={activeFilters.includes(option)}
                              onCheckedChange={() => toggleFilter(option)}
                              className="h-4 w-4 rounded-sm border-neutral-300"
                            />
                            <label
                              htmlFor={`filter-mobile-${group.name}-${option}`}
                              className="ml-2 text-sm text-neutral-700"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
              <div className="sticky bottom-0 border-t border-neutral-200 bg-white p-4">
                <Button 
                  className="w-full" 
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="w-full lg:w-3/4">
              <div className="mb-6">
                <p className="text-sm text-neutral-600">
                  Showing <span className="font-medium">{products.length}</span> products
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 fade-in-group">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                    isNew={product.isNew}
                    discount={product.discount}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                    1
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100">
                    2
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100">
                    3
                  </button>
                  <span className="flex h-9 items-center justify-center px-1 text-neutral-400">
                    ...
                  </span>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100">
                    8
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700">
                    <ChevronDown className="h-4 w-4 rotate-270" />
                    <span className="sr-only">Next Page</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
