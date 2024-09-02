import { NextResponse } from 'next/server';
import Replicate from "replicate";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function uploadImageToSupabase(imageUrl, userId) {
  console.log('Attempting to fetch image from:', imageUrl);
  
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('Image fetched, size:', buffer.length, 'bytes');
    
    // Determine file extension from Content-Type
    const contentType = response.headers.get('Content-Type');
    let fileExtension = 'png'; // default
    if (contentType === 'image/webp') {
      fileExtension = 'webp';
    } else if (contentType === 'image/jpeg') {
      fileExtension = 'jpg';
    }
    
    const fileName = `${userId}_${Date.now()}.${fileExtension}`;
    console.log('Uploading file:', fileName);
    
    const { data, error } = await supabase.storage
      .from('outfit-images')
      .upload(fileName, buffer, {
        contentType: contentType,
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading to Supabase:', error);
      throw error;
    }
    
    console.log('Upload successful, data:', data);
    
    const { data: publicUrlData } = supabase.storage
      .from('outfit-images')
      .getPublicUrl(fileName);

    console.log('Public URL:', publicUrlData.publicUrl);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error);
    throw error;
  }
}

async function storeImageData(userId, imageUrl, prompt, isPublic, occasion, season, style, colorPalette, formality) {
  try {
    const { data, error } = await supabase
      .from('outfit_images')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        prompt: prompt,
        is_public: isPublic,
        occasion: occasion,
        season: season,
        style: style,
        color_palette: colorPalette,
        formality: formality,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in storeImageData:', error);
    throw error;
  }
}

export async function POST(request) {
  console.log('API route hit');
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const { prompt, isPublic, userId, occasion, season, style, colorPalette, formality } = await request.json();
    console.log('Received request:', { prompt, isPublic, userId, occasion, season, style, colorPalette, formality });

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    console.log('Running Replicate model');
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      { input: { prompt } }
    );

    if (!output || output.length === 0) {
      throw new Error("No image URL returned from the model");
    }

    const imageUrl = output[0];
    console.log('Image URL from Replicate:', imageUrl);

    const storedImageUrl = await uploadImageToSupabase(imageUrl, userId);
    console.log('Stored image URL:', storedImageUrl);

    const storedData = await storeImageData(userId, storedImageUrl, prompt, isPublic, occasion, season, style, colorPalette, formality);
    console.log('Stored data:', storedData);

    return NextResponse.json(storedData);
  } catch (error) {
    console.error('Detailed error in generateImage:', error);
    return NextResponse.json({ error: 'Error generating image', details: error.message }, { status: 500 });
  }
}