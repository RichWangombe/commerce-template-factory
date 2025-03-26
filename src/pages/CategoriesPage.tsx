
import { MainLayout } from '@/components/layouts/MainLayout';
import { motion } from 'framer-motion';
import { categories } from '@/data/homePageData';
import { CategoryCard } from '@/components/CategoryCard';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

const CategoriesPage = () => {
  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-40 left-20 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl"></div>
          <div className="absolute bottom-40 right-20 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-teal-300/20 blur-[100px]"></div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 z-0 opacity-5 bg-[radial-gradient(circle,_transparent_20%,_#f0f0f0_20%,_#f0f0f0_calc(20%_+_1px),_transparent_calc(20%_+_2px))] dark:bg-[radial-gradient(circle,_transparent_20%,_#111_20%,_#111_calc(20%_+_1px),_transparent_calc(20%_+_2px))] bg-[length:24px_24px]"></div>
        </div>
        
        <div className="relative z-10">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Categories', href: '/categories' }
            ]}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2 mt-8 mb-10"
          >
            <h1 className="text-3xl font-bold">All Categories</h1>
            <p className="text-muted-foreground">Explore our wide range of products</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                icon={category.icon}
                productCount={category.productCount}
                backgroundImages={category.backgroundImages}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoriesPage;
