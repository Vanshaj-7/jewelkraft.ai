import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Gem } from 'lucide-react';
import PromptInput from '../components/PromptInput';
import ImageGallery from '../components/ImageGallery';
import axios from 'axios';
import { cn } from '../utils/classNames';

interface GenerationResponse {
  success: boolean;
  prompt: string;
  images: string[];
  message: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handlePromptSubmit = async (promptText: string) => {
    setIsLoading(true);
    setError(null);
    setPrompt(promptText);
    setGeneratedImages([]);
    setProgress(0);
    setSelectedImage(null);
    
    try {
      const response = await axios.post<GenerationResponse>(
        'http://localhost:5000/api/generate',
        { prompt: promptText },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 120000 // Increased timeout to 2 minutes for multiple images
        }
      );
      
      if (response.data.success) {
        console.log('Received images:', response.data.images);
        setGeneratedImages(response.data.images);
        setProgress(100);
      } else {
        throw new Error(response.data.message || 'Failed to generate images');
      }
    } catch (err) {
      console.error('Error generating images:', err);
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again.');
        } else {
          setError(err.response?.data?.message || 'Failed to generate images. Please try again.');
        }
      } else {
        setError('Failed to generate images. Please try again.');
      }
      setGeneratedImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProductDetails = () => {
    if (selectedImage) {
      navigate('/product', { 
        state: { 
          selectedImage,
          prompt
        }
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-luxury-cream to-white py-24 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight leading-tight">
              Transform Your Words into <span className="text-gold-600">Exquisite Jewelry</span>
            </h1>
            <p className="text-xl text-neutral-700 leading-relaxed">
              Use AI to design custom jewelry pieces exactly as you imagine them. From concept to creation, in seconds.
            </p>
            <div className="pt-4">
              <PromptInput onSubmit={handlePromptSubmit} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </section>

      {/* Generated Images Section */}
      <section className="py-16 bg-white">
        <div className="container">
          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg max-w-3xl mx-auto">
              {error}
            </div>
          )}
          
          {(isLoading || generatedImages.length > 0 || prompt) && (
            <div className="max-w-5xl mx-auto">
              {prompt && (
                <div className="mb-8">
                  <h2 className="text-2xl font-serif mb-2">Generated Designs</h2>
                  <p className="text-neutral-500">Based on: "{prompt}"</p>
                  {isLoading && (
                    <div className="mt-4">
                      <div className="w-full bg-neutral-100 rounded-full h-2.5">
                        <div 
                          className="bg-gold-500 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-neutral-500 mt-2">
                        Generating multiple design variations... {progress}%
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <ImageGallery 
                images={generatedImages} 
                isLoading={isLoading} 
                onProgress={setProgress}
                onImageSelect={setSelectedImage}
              />
              
              {generatedImages.length > 0 && (
                <div className="mt-12 text-center">
                  <button 
                    onClick={handleViewProductDetails}
                    disabled={!selectedImage}
                    className={cn(
                      "inline-flex items-center px-8 py-3 rounded-full transition-colors shadow-md hover:shadow-lg",
                      selectedImage 
                        ? "bg-gold-600 text-white hover:bg-gold-500" 
                        : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                    )}
                  >
                    <span>View Product Details</span>
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-neutral-50" id="about">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">How It Works</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Our AI-powered platform transforms your ideas into stunning jewelry designs in just a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Sparkles size={28} className="text-gold-500" />}
              title="Describe Your Vision"
              description="Enter a detailed description of your dream jewelry piece using natural language."
              number={1}
            />
            <FeatureCard 
              icon={<Gem size={28} className="text-gold-500" />}
              title="AI Creates Designs"
              description="Our advanced AI generates multiple realistic jewelry designs based on your description."
              number={2}
            />
            <FeatureCard 
              icon={<ArrowRight size={28} className="text-gold-500" />}
              title="Customize & Order"
              description="Select your favorite design, customize materials and details, and place your order."
              number={3}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-neutral-900 text-white" id="contact">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif">Ready to Create Your Custom Jewelry?</h2>
            <p className="text-neutral-400 text-lg">
              Join thousands of customers who have already discovered the power of AI-designed jewelry.
            </p>
            <div>
              <button className="px-8 py-4 bg-gold-500 hover:bg-gold-400 transition-colors text-white rounded-full font-medium shadow-lg">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, number }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-soft relative group hover:shadow-md transition-shadow">
      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center font-medium">
        {number}
      </div>
      <div className="mb-4 text-gold-500">{icon}</div>
      <h3 className="text-xl font-serif mb-3">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </div>
  );
};

export default HomePage;