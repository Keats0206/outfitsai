"use client"

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarDays, Briefcase, GlassWater, Sparkles, Shirt } from 'lucide-react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';

export interface OutfitGeneratorProps {
  user: User
}

interface OutfitData {
  id: string;
  user_id: string;
  image_url: string;
  prompt: string;
  is_public: boolean;
  occasion: string;
  season: string;
  style: string;
  color_palette: string;
  formality: number;
  created_at: string;
}

interface FormData {
  [key: string]: string | number | boolean;
  occasion: string;
  gender: string;
  style: string;
  clothingType: string;
  colorPalette: string;
  season: string;
  additionalTheme: string;
  year: string;
  celebrity: string;
  scene: string;
  cameraStyle: string;
  formality: number;
  isPublic: boolean;
}
// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

interface GridSelectProps {
  options: Array<{ value: string; label: string; icon?: React.ReactNode }>;
  value: string;
  onChange: (name: string, value: string) => void;
  name: string;
}

const GridSelect = ({ options, value, onChange, name }: GridSelectProps) => (
  <div>
    <p className='pb-2 opacity-50 uppercase'>{name}</p>
    <RadioGroup
      defaultValue={value}
      onValueChange={(value) => onChange(name, value)}
      className="grid grid-cols-3 gap-4"
    >
      {options.map((option) => (
        <div key={option.value}>
          <RadioGroupItem
            value={option.value}
            id={`${name}-${option.value}`}
            className="peer sr-only"
          />
          <Label
            htmlFor={`${name}-${option.value}`}
            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <span>{option.label}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  </div>
);

const occasionOptions = [
  'Concert', 'Party', 'Wedding', 'Graduation', 'Birthday', 'Dinner', 'Brunch', 'Club', 'Festival', 'Photoshoot',
  'Christmas', 'Thanksgiving', 'Beach', 'School', 'Date Night', 'Baby Shower', 'Renaissance Fair', 'Disco', 'Rave',
  'Movie Premiere', 'Senior Prom', "New Year's Eve", 'Halloween'
].map(value => ({ value: value.toLowerCase().replace(/\s+/g, '_'), label: value }));

const genderOptions = [
  'Women', 'Men', 'Girls', 'Boys', 'Female', 'Male', 'Ladies', 'Guys', 'Plus Size Women', 'Plus Size Men'
].map(value => ({ value: value.toLowerCase().replace(/\s+/g, '_'), label: value }));

const styleOptions = [
  'Casual', 'Cute', 'Preppy', 'Western', 'Vintage', 'Boho', 'Chic', 'Elegant', 'Streetwear', 'Athletic',
  'Formal', 'Edgy', 'Minimalist', 'Glamorous', 'Retro', 'Country', 'Cowgirl/Cowboy', 'Denim', 'Leather',
  'Floral', 'Sparkly/Sequined'
].map(value => ({ value: value.toLowerCase().replace(/\s+/g, '_'), label: value }));

const clothingTypeOptions = [
  'Dress', 'Skirt', 'Pants', 'Jeans', 'Shorts', 'Shirt', 'Blazer', 'Jacket', 'Sweater', 'Top',
  'Cargo Pants', 'Jumpsuit', 'Romper', 'Suit', 'Hoodie', 'T-Shirt'
].map(value => ({ value: value.toLowerCase().replace(/\s+/g, '_'), label: value }));

const colorPaletteOptions = [
  'Black', 'White', 'Red', 'Blue', 'Pink', 'Green', 'Brown', 'Purple', 'Yellow', 'Orange',
  'Grey', 'Pastels', 'Neon Colors', 'Earth Tones', 'Monochrome'
].map(value => ({ value: value.toLowerCase().replace(/\s+/g, '_'), label: value }));

const seasonOptions = [
  'Spring', 'Summer', 'Fall/Autumn', 'Winter', 'Daytime', 'Nighttime', '2023', '2024'
].map(value => ({ value: value.toLowerCase().replace(/\s+/g, '_'), label: value }));

const additionalThemeOptions = [
  'Barbie', 'Taylor Swift', 'Beyonce', 'Jordan', 'Gacha', 'Roblox', 'Renaissance', 'Eras Tour',
  'Graduation Theme', 'Festival Vibes', 'Holiday', 'Sportswear', 'Professional/Work'
].map(value => ({ value: value.toLowerCase().replace(/\s+/g, '_'), label: value }));

const accessoryOptions = [
  'Boots', 'Sneakers', 'Heels', 'Sandals', 'Hats', 'Scarves', 'Belts', 'Jewelry', 'Bags/Purses',
  'Sunglasses', 'Watches'
].map(value => ({ value: value.toLowerCase().replace(/\s+/g, '_'), label: value }));

const sceneOptions = [
  'Urban Street', 'Beachside', 'Forest/Nature', 'Concert Stage', 'Red Carpet', 'Coffee Shop', 'Rooftop',
  'Art Gallery', 'Runway', 'Festival Grounds', 'Vintage Room', 'Modern Apartment', 'Sunset Background',
  'Night Cityscape', 'Classroom', 'Garden'
].map(value => ({ value: value.toLowerCase().replace(/\s+/g, '_'), label: value }));

const cameraStyleOptions = [
  'Portrait Mode', 'Wide Angle', 'Close-Up', 'Full Body Shot', 'Candid Style', 'Studio Lighting',
  'Natural Lighting', 'Black and White', 'HDR', 'Soft Focus', 'High Contrast', 'Retro Filter',
  'Polaroid Style', 'Cinematic', 'Street Photography', 'Fashion Editorial'
].map(value => ({ value: value.toLowerCase().replace(/\s+/g, '_'), label: value }));

const categoryOptions = {
  occasion: { label: "Occasion/Theme", options: occasionOptions },
  gender: { label: "Gender/Target Audience", options: genderOptions },
  style: { label: "Style", options: styleOptions },
  clothingType: { label: "Clothing Type", options: clothingTypeOptions },
  colorPalette: { label: "Color Palette", options: colorPaletteOptions },
  season: { label: "Season/Time", options: seasonOptions },
  additionalTheme: { label: "Additional Themes", options: additionalThemeOptions },
  accessory: { label: "Accessories", options: accessoryOptions },
  scene: { label: "Scene", options: sceneOptions },
  cameraStyle: { label: "Camera Style", options: cameraStyleOptions },
};
export default function OutfitGenerator({ user }: OutfitGeneratorProps) {
  const [outfitData, setOutfitData] = useState<OutfitData | null>(null);
  const [mode, setMode] = useState('guided');
  const [formData, setFormData] = useState<FormData>({
    occasion: '',
    gender: '',
    style: '',
    clothingType: '',
    colorPalette: '',
    season: '',
    additionalTheme: '',
    year: '',
    celebrity: '',
    scene: '',
    cameraStyle: '',
    formality: 50, // Initialize with a number value
    isPublic: true,
  });
  const [aiGeneratedPrompt, setAiGeneratedPrompt] = useState('A photo of a woman model wearing a cute fall outfit. The outfit consists of an oversized beige sweater tucked slightly into a pair of high-waisted, dark-wash skinny jeans. She pairs the look with ankle boots in a rich brown leather. The model accessorizes with a chunky knit scarf in a warm rust color and a wide-brimmed hat in a matching shade. The background features an outdoor autumn setting with golden leaves scattered on the ground and trees with colorful foliage. The overall vibe is cozy and stylish, perfect for a crisp fall day.');
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateAIPrompt = async (e: any) => {
    e.preventDefault();
    setIsLoadingPrompt(true);
    setError('');
    try {
      const response = await fetch('/api/generatePrompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }
      const data = await response.json();
      setAiGeneratedPrompt(data.prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      setError('Failed to generate prompt. Please try again.');
    }
    setIsLoadingPrompt(false);
  };

  const generateOutfit = async () => {
    if (!user) {
      setError('Please log in to generate an outfit.');
      return;
    }
    setIsLoadingPrompt(true);
    setError('');
    try {
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: aiGeneratedPrompt,
          isPublic: formData.isPublic,
          userId: user.id,
          occasion: formData.occasion,
          season: formData.season,
          style: formData.style,
          colorPalette: formData.colorPalette,
          formality: formData.formality
        }),
      });
  
      // Log the response status and content
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      const textResponse = await response.text();
      console.log('Raw response:', textResponse);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = JSON.parse(textResponse);
      setOutfitData(data);
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image. Please try again.');
    }
    setIsLoadingPrompt(false);
  };

  const occasionOptions = [
    { value: 'casual', label: 'Casual', icon: <CalendarDays className="mb-2 h-6 w-6" /> },
    { value: 'business', label: 'Business', icon: <Briefcase className="mb-2 h-6 w-6" /> },
    { value: 'formal', label: 'Formal', icon: <GlassWater className="mb-2 h-6 w-6" /> },
    { value: 'party', label: 'Party', icon: <Sparkles className="mb-2 h-6 w-6" /> },
    { value: 'date', label: 'Date', icon: <Shirt className="mb-2 h-6 w-6" /> },
  ];

  const seasonOptions = [
    { value: 'spring', label: 'Spring', image: '/api/placeholder/160/120' },
    { value: 'summer', label: 'Summer', image: '/api/placeholder/160/120' },
    { value: 'fall', label: 'Fall', image: '/api/placeholder/160/120' },
    { value: 'winter', label: 'Winter', image: '/api/placeholder/160/120' },
  ];

  const styleOptions = [
    { value: 'modern', label: 'Modern', image: '/api/placeholder/160/120' },
    { value: 'vintage', label: 'Vintage', image: '/api/placeholder/160/120' },
    { value: 'minimalist', label: 'Minimalist', image: '/api/placeholder/160/120' },
    { value: 'streetwear', label: 'Streetwear', image: '/api/placeholder/160/120' },
    { value: 'highfashion', label: 'High Fashion', image: '/api/placeholder/160/120' },
  ];

  return (
    <div className="flex flex-row min-h-screen bg-gray-100">
      <div className="flex-2 min-1 w-[500px] p-8">
        <Card>
          <CardHeader>
            <CardTitle>Outfit Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='w-full flex justify-start'>
              <ToggleGroup type="single" value={mode} onValueChange={(value) => setMode(value)} className="mb-4">
                <ToggleGroupItem value="guided">Guided</ToggleGroupItem>
                <ToggleGroupItem value="prompt">Prompt</ToggleGroupItem>
              </ToggleGroup>
            </div>
            {mode === 'guided' ? (
              <form className="space-y-8">
                {Object.entries(categoryOptions).map(([key, { label, options }]) => (
                  <GridSelect
                    key={key}
                    options={options}
                    value={String(formData[key])}
                    onChange={handleInputChange}
                    name={key}
                  />
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Color Palette</label>
                  <Input 
                    type="text" 
                    placeholder="e.g., navy, burgundy, cream" 
                    onChange={(e) => handleInputChange('colorPalette', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Image Visibility</label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="visibility-switch" 
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                    />
                    <label htmlFor="visibility-switch">
                      {formData.isPublic ? 'Public' : 'Private'}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Outfit Formality</label>
                  <Slider 
                    defaultValue={[50]} 
                    max={100} 
                    step={1} 
                    onValueChange={(value) => handleInputChange('formality', value[0])}
                  />
                </div>
                <Button onClick={generateAIPrompt} disabled={isLoadingPrompt}>
                  {isLoadingPrompt ? 'Generating...' : 'Generate AI Prompt'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <Textarea 
                  value={aiGeneratedPrompt} 
                  onChange={(e) => setAiGeneratedPrompt(e.target.value)}
                  rows={6}
                  placeholder="Enter your prompt here or generate one using the guided mode"
                  className="mb-4"
                />
                <div className="flex items-center space-x-2 mb-4">
                  <Switch 
                    id="visibility-switch" 
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                  />
                  <label htmlFor="visibility-switch">
                    {formData.isPublic ? 'Public' : 'Private'}
                  </label>
                </div>
                <Button onClick={generateOutfit} disabled={!aiGeneratedPrompt || isLoadingPrompt}>
                  {isLoadingPrompt ? 'Generating...' : 'Generate Outfit from Prompt'}
                </Button>
              </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
          </CardContent>
        </Card>
      </div>
        <div className="flex-1 p-8">
            <Card className="mb-8">
                <CardHeader>
                <CardTitle>Generated Outfit</CardTitle>
                </CardHeader>
                <CardContent>
                {outfitData ? (
                    <OutfitDisplay outfitData={outfitData} />
                  ) : (
                    <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-gray-700">Your generated outfit will appear here.</p>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

function OutfitDisplay({ outfitData }: { outfitData: OutfitData }) {
  const [isLoading, setIsLoading] = useState(true);

  const tags = [
    outfitData.occasion,
    outfitData.season,
    outfitData.style,
    outfitData.color_palette,
    `Formality: ${outfitData.formality}`
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 animate-pulse">
            <div className="h-full w-full bg-gray-300"></div>
          </div>
        )}
        <img 
          src={outfitData.image_url} 
          alt="Generated outfit" 
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}