"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderSection from '@/components/HeaderSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ClothingItemProps {
  imageUrl: string;
  name: string;
  price: number;
}

const ClothingItem: React.FC<ClothingItemProps> = ({ imageUrl, name, price }) => (
  <Card className="max-w-sm">
    <CardHeader>
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
    </CardHeader>
    <CardContent>
      <CardTitle className="text-lg">{name}</CardTitle>
      <p className="text-gray-600">${price.toFixed(2)}</p>
    </CardContent>
    <CardFooter>
      <Button variant="outline">View Item</Button>
    </CardFooter>
  </Card>
);

const StylePage = () => {
  // Mock data store - in a real application, this would be fetched from an API or database
  const styleData = {
      name: "Rustic",
      description: "Embrace the warmth and comfort of our rustic style collection, featuring natural materials and earthy tones.",
      clothingItems: [
        { imageUrl: "/api/placeholder/400/300", name: "Flannel Shirt", price: 59.99 },
        { imageUrl: "/api/placeholder/400/300", name: "Distressed Jeans", price: 89.99 },
        { imageUrl: "/api/placeholder/400/300", name: "Leather Boots", price: 149.99 },
        { imageUrl: "/api/placeholder/400/300", name: "Wool Sweater", price: 79.99 },
        { imageUrl: "/api/placeholder/400/300", name: "Canvas Jacket", price: 99.99 },
        { imageUrl: "/api/placeholder/400/300", name: "Corduroy Pants", price: 69.99 },
      ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <HeaderSection 
          title={styleData.name} 
          subtitle={styleData.description} 
      />
      <section>
        <h3 className="text-2xl font-semibold mb-4">Clothing Examples</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {styleData.clothingItems.map((item, index) => (
            <ClothingItem key={index} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default StylePage;