import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ModelComparisonDashboard } from '@/components/comparison/ModelComparisonDashboard';

const Compare = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Handle shared comparison URLs
    const models = searchParams.get('models');
    if (models) {
      // The ModelComparisonDashboard will handle the shared models
      console.log('Shared comparison:', models.split(','));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
        <ModelComparisonDashboard />
      </main>

      <Footer />
    </div>
  );
};

export default Compare;

