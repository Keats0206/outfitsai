import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import HeaderSection from '@/components/HeaderSection';

// Define the props type
interface StyleCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

// StyleCard component
const StyleCard = ({ imageUrl, title, description }: StyleCardProps) => (
  <Card className="max-w-sm">
    <CardHeader>
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
    </CardHeader>
    <CardContent>
      <CardTitle>{title}</CardTitle>
      <p>{description}</p>
    </CardContent>
    <CardFooter>
      <Link href='/styles/${slug}'>
        <Button variant="outline">View Style</Button>
      </Link>
    </CardFooter>
  </Card>
);

// Main Page component
const StylePage = () => {
  const styles = [
    { 
      slug: "modern",
      imageUrl: "/api/placeholder/400/300", 
      title: "Modern", 
      description: "Clean lines and minimalist design" 
    },
    { 
      slug: "rustic",
      imageUrl: "/api/placeholder/400/300", 
      title: "Rustic", 
      description: "Warm and natural elements" 
    },
    { 
      slug: "industrial",
      imageUrl: "/api/placeholder/400/300", 
      title: "Industrial", 
      description: "Raw materials and exposed structures" 
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex flex-col items-center my-24'>
        <HeaderSection 
          title="Explore Our Styles" 
          subtitle="Find the perfect look for your space"
        >
        </HeaderSection>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {styles.map((style) => (
          <Link href={`/styles/${style.slug}`} key={style.slug}>
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <img src={style.imageUrl} alt={style.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{style.title}</h2>
                <p>{style.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StylePage;