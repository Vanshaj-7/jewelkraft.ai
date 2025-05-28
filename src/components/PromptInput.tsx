import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../utils/classNames';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your dream jewelry piece..."
          className={cn(
            "w-full px-6 py-4 pr-36 text-lg rounded-full border border-neutral-200",
            "focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-transparent",
            "transition-all shadow-soft hover:shadow-md",
            "placeholder:text-neutral-400"
          )}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={cn(
            "absolute right-2 top-2 bottom-2 px-6 rounded-full flex items-center justify-center",
            "text-white font-medium transition-all",
            isLoading ? 
              "bg-neutral-400 cursor-not-allowed" : 
              "bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400",
            "shadow-sm hover:shadow"
          )}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-white rounded-full"></div>
              <span>Creating</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Sparkles size={18} />
              <span>Generate</span>
            </div>
          )}
        </button>
      </form>
      <p className="text-neutral-500 text-sm mt-2 text-center">
        Example: "A delicate gold necklace with diamond pendant" or "Sapphire engagement ring with platinum band"
      </p>
    </div>
  );
};

export default PromptInput;