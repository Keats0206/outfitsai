"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { createClient } from '@supabase/supabase-js'


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ImageUploadCard = ({ title, image, onImageUpload, exampleText, disabled }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
         className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
         onDragOver={disabled ? null : handleDragOver}
         onDrop={disabled ? null : handleDrop}
        >
          {image ? (
            <img src={image} alt="Uploaded" className="max-w-full h-auto mx-auto" />
          ) : (
            <div>
              <Upload className="mx-auto mb-2" size={48} />
              <p>Drag and drop an image here, or click to select a file</p>
              <p className="text-sm text-gray-500 mt-2">{exampleText}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PlaceholderContent = ({ isLoggedIn }) => (
  <div className="text-center">
    <h1 className="text-3xl font-bold mb-4">Virtual Fitting Room</h1>
    <h2 className="text-xl mb-6">Try on clothes virtually with AI technology</h2>
    <p className="mb-8">Upload your photo and a clothing item to see how it looks on you!</p>
    {!isLoggedIn && (
      <Link href="/signin">
        <Button>Login to Start</Button>
      </Link>
    )}
  </div>
);

const VirtualFittingRoom = () => {
  const { user } = useAuth()
  const router = useRouter()
  
  const [userImage, setUserImage] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [clothingDescription, setClothingDescription] = useState('');
  const [category, setCategory] = useState('upper_body');
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/signin')
      return
    }
    setProgress(0);

    const formData = new FormData();
    formData.append('userImage', dataURItoBlob(userImage));
    formData.append('clothingImage', dataURItoBlob(clothingImage));
    formData.append('clothingDescription', clothingDescription);
    formData.append('category', category);

    try {
      const response = await fetch('/api/virtual-fitting', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const reader = response.body.getReader();
      const contentLength = +response.headers.get('Content-Length');
      let receivedLength = 0;
      let chunks = [];

      while(true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;
        setProgress(Math.round((receivedLength / contentLength) * 100));
      }

      const chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      for(let chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
      }

      const result = new TextDecoder("utf-8").decode(chunksAll);
      const data = JSON.parse(result);
      setResultImage(data.result);
    } catch (err) {
      console.error("Error processing images:", err);
      setError("An error occurred while processing the images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="w-screen flex flex-row">
      <div className='w-2/5 p-4'>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUploadCard 
            title="Upload Your Image" 
            image={userImage} 
            onImageUpload={setUserImage}
            exampleText="Upload a clear, full-body photo of yourself against a plain background."
            disabled={!isAuthenticated}
          />
          <ImageUploadCard 
            title="Upload Clothing Item to Try On" 
            image={clothingImage} 
            onImageUpload={setClothingImage}
            exampleText="Upload a clear image of the clothing item on a white background, ideally from a fashion website."
            disabled={!isAuthenticated}
         />
          <Card>
            <CardHeader>
              <CardTitle>Describe the Clothing Item</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="E.g., Red cotton t-shirt with short sleeves"
                value={clothingDescription}
                onChange={(e) => setClothingDescription(e.target.value)}
                disabled={!isAuthenticated}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Select Garment Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={category} onValueChange={setCategory} disabled={!isAuthenticated}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upper_body">Upper Body</SelectItem>
                  <SelectItem value="lower_body">Lower Body</SelectItem>
                  <SelectItem value="dresses">Dresses (Beta)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-2">
                Note: Dresses and bikinis are currently in beta and may not work as well.
              </p>
            </CardContent>
          </Card>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!user || isLoading || !userImage || !clothingImage || !clothingDescription}
          >
            {isLoading ? "Processing..." : user ? "Generate Virtual Fitting" : "Login to Generate"}
          </Button>
        </form>
      </div>
      <div className='p-12 sticky top-0 h-screen flex items-center justify-center w-3/5'>
        {!isLoading && !resultImage && !error && (
          <PlaceholderContent isLoggedIn={!!user} />
        )}
        {isLoading && (
          <Card className="w-full max-w-md">
            <CardContent className="text-center p-4">
              <p className="mb-4">Processing your images...this may take up to a minute.</p>
              <Progress value={progress} className="w-full" />
            </CardContent>
          </Card>
        )}
        {error && (
          <Card>
            <CardContent className="text-center p-4 text-red-500">
              <p>{error}</p>
            </CardContent>
          </Card>
        )}
        {resultImage && (
          <Card className='h-full w-full overflow-hidden'>
            <CardHeader>
              <CardTitle>Virtual Fitting Result</CardTitle>
            </CardHeader>
            <CardContent className='pb-12 h-full overflow-hidden'>
              <img src={resultImage} alt="Virtual Fitting Result" className="overflow-hidden max-w-full h-auto mx-auto" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VirtualFittingRoom;