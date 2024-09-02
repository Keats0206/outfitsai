import Image from 'next/image';
import { Heart, Download } from 'lucide-react';

const FavoritesPage = () => {
  const generations = [
    { id: 1, imageUrl: '/path/to/image1.jpg', prompt: 'A futuristic cityscape' },
    { id: 2, imageUrl: '/path/to/image2.jpg', prompt: 'A serene forest scene' },
    { id: 3, imageUrl: '/path/to/image1.jpg', prompt: 'A futuristic cityscape' },
    { id: 4, imageUrl: '/path/to/image2.jpg', prompt: 'A serene forest scene' },
    { id: 5, imageUrl: '/path/to/image1.jpg', prompt: 'A futuristic cityscape' },
    { id: 6, imageUrl: '/path/to/image2.jpg', prompt: 'A serene forest scene' },
    // Add more mock data as needed
  ];

  return (
    <div className="container mx-auto px-8 py-8">
      <h1 className="text-xl font-bold mb-6">Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {generations.map((gen) => (
          <div key={gen.id} className="border rounded-lg p-4 shadow-sm">
            <Image src={gen.imageUrl} alt={gen.prompt} width={300} height={300} className="w-full h-48 object-cover mb-2 rounded" />
            <p className="text-sm mb-2">Prompt: {gen.prompt}</p>
            <div className="flex justify-between">
              <button className="text-gray-600 hover:text-red-500"><Heart size={20} /></button>
              <button className="text-gray-600 hover:text-blue-500"><Download size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;