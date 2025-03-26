
import { MainLayout } from '@/components/layouts/MainLayout';
import { Link } from 'react-router-dom';
import { categories } from '@/data/homePageData';
import { CategoryCard } from '@/components/CategoryCard';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

const CategoriesPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-40 left-20 h-72 w-72 rounded-full bg-purple-300 blur-3xl"></div>
          <div className="absolute bottom-40 right-20 h-72 w-72 rounded-full bg-blue-300 blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Categories', href: '/categories' }
            ]}
          />
          
          <h1 className="text-3xl font-bold mt-8 mb-6">All Categories</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                icon={category.icon}
                productCount={category.productCount}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoriesPage;
