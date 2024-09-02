import { NextResponse } from 'next/server';
import Replicate from "replicate";

export async function POST(request) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
  const { formData } = await request.json();

  const prompt = `Create a detailed description of a photograph showing a ${formData.gender} wearing an outfit for a ${formData.occasion} in ${formData.season}. The outfit should be in a ${formData.style} style, incorporating a color palette of ${formData.colorPalette}. The formality level is ${formData.formality}%. Describe the specific clothing items, accessories, and how they are worn. Include details about the person's pose and the background setting that complements the outfit. Please return only a prompt that simply describes the scene, and is under 250 characters.`;

  const input = {
    top_p: 0.9,
    prompt: prompt,
    min_tokens: 0,
    temperature: 0.6,
    prompt_template: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful fashion assistant<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
    presence_penalty: 1.15
  };

  try {
    let response = '';
    for await (const event of replicate.stream("meta/meta-llama-3-70b-instruct", { input })) {
      response += event;
    }
    return NextResponse.json({ prompt: response });
  } catch (error) {
    console.error('Error in generatePrompt:', error);
    return NextResponse.json({ error: 'Error generating prompt', details: error.message }, { status: 500 });
  }
}