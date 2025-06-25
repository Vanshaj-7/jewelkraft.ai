import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Gem } from 'lucide-react';
import PromptInput from '../components/PromptInput';
import ImageGallery from '../components/ImageGallery';
import axios from 'axios';
import { cn } from '../utils/classNames';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import config from '../config';
import { storageService } from '../services/storage';
import { Design } from '../types';

interface GenerationResponse {
  success: boolean;
  prompt: string;
  images: string[];
  message: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<Design[]>([]);

  useEffect(() => {
    // Load saved designs on component mount
    const designs = storageService.getDesigns();
    setSavedDesigns(designs);
  }, []);

  const handlePromptSubmit = async (promptText: string) => {
    setIsLoading(true);
    setError(null);
    setPrompt(promptText);
    setGeneratedImages([]);
    setProgress(0);
    setSelectedImage(null);
    
    try {
      const response = await axios.post<GenerationResponse>(
        `${config.apiUrl}/api/generate`,
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
        showToast('Images generated successfully!', 'success');

        // Save the design
        const newDesign: Design = {
          id: `${crypto.randomUUID()}-${Date.now()}`,
          userId: 'guest', // We'll update this when we add authentication
          prompt: promptText,
          images: response.data.images,
          createdAt: new Date().toISOString(),
          status: 'draft'
        };
        
        storageService.saveDesign(newDesign);
        setSavedDesigns(prev => [...prev, newDesign]);
      } else {
        throw new Error(response.data.message || 'Failed to generate images');
      }
    } catch (err) {
      console.error('Error generating images:', err);
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          showToast('Request timed out. Please try again.', 'error');
        } else {
          showToast(err.response?.data?.message || 'Failed to generate images. Please try again.', 'error');
        }
      } else {
        showToast('Failed to generate images. Please try again.', 'error');
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
      <section className="py-20 md:py-28 bg-primary-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight leading-tight text-gray-900">
              Transform Your Words into <span className="shimmer-gradient">Exquisite Silver Jewelry</span>
            </h1>
            <p className="text-xl text-gray-900 leading-relaxed">
              Discover the elegance of custom silver jewelry, designed by AI and crafted for you.
            </p>
            <div className="pt-2">
              <PromptInput onSubmit={handlePromptSubmit} isLoading={isLoading} inputId="prompt-input" />
            </div>
          </div>
        </div>
      </section>

      {/* Generated Images Section */}
      <section className="py-16 bg-primary-50">
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
                          className="bg-primary-500 h-2.5 rounded-full transition-all duration-300"
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
              
              {isLoading ? (
                <div className="py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <ImageGallery 
                  images={generatedImages} 
                  isLoading={isLoading} 
                  onProgress={setProgress}
                  onImageSelect={setSelectedImage}
                />
              )}
              
              {generatedImages.length > 0 && (
                <div className="mt-12 text-center">
                  <button 
                    onClick={handleViewProductDetails}
                    disabled={!selectedImage}
                    className={cn(
                      "inline-flex items-center px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg font-medium border border-primary-200",
                      selectedImage 
                        ? "bg-primary-100 text-primary-600 hover:bg-white hover:text-primary-800" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
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

      {/* Saved Designs Section */}
      {savedDesigns.length > 0 && (
        <section className="py-16 bg-neutral-50">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-serif mb-8">Your Saved Designs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedDesigns.map(design => (
                  <div 
                    key={design.id}
                    className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-neutral-50">
                      <img 
                        src={design.images[0]} 
                        alt={design.prompt}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-neutral-600 line-clamp-2 mb-4">
                        {design.prompt}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedImage(design.images[0]);
                          setPrompt(design.prompt);
                          navigate('/product', {
                            state: {
                              selectedImage: design.images[0],
                              prompt: design.prompt
                            }
                          });
                        }}
                        className="w-full py-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-primary-50" id="about">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-gray-900">How It Works</h2>
            <p className="text-gray-900 max-w-2xl mx-auto">
              Our AI-powered platform transforms your ideas into stunning silver jewelry designs in just a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Sparkles size={28} className="text-primary-600" />}
              title="Describe Your Vision"
              description="Enter a detailed description of your dream silver jewelry piece using natural language."
              number={1}
            />
            <FeatureCard 
              icon={<Gem size={28} className="text-primary-600" />}
              title="AI Creates Designs"
              description="Our advanced AI generates multiple realistic silver jewelry designs based on your description."
              number={2}
            />
            <FeatureCard 
              icon={<ArrowRight size={28} className="text-primary-600" />}
              title="Customize & Order"
              description="Select your favorite silver design, customize details, and place your order."
              number={3}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary-50 text-gray-900" id="contact">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">Ready to Create Your Custom Silver Jewelry?</h2>
            <p className="text-gray-900 text-lg">
              Join thousands of customers who have already discovered the beauty of AI-designed silver jewelry.
            </p>
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
    <div className="bg-card p-8 relative group hover:shadow-lg transition-shadow">
      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium shadow-md border border-primary-200">
        {number}
      </div>
      <div className="mb-4 text-primary-600">{icon}</div>
      <h3 className="text-xl font-serif mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-900">{description}</p>
    </div>
  );
};

export default HomePage;