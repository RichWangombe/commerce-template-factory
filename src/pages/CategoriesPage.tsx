
import { MainLayout } from '@/components/layouts/MainLayout';
import { Link } from 'react-router-dom';
import { categories } from '@/data/homePageData';
import { CategoryCard } from '@/components/CategoryCard';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

const CategoriesPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Categories', href: '/categories' }
          ]}
        />
        
        <h1 className="text-3xl font-bold mt-8 mb-6">All Categories</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              icon={category.icon}
              productCount={category.productCount}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoriesPage;
