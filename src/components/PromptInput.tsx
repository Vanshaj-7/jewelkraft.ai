import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { validatePrompt, ValidationError } from '../utils/validation';
import { useToast } from '../context/ToastContext';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  inputId?: string;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading, inputId }) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<ValidationError | null>(null);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validatePrompt(prompt);
    if (validationError) {
      setError(validationError);
      showToast(validationError.message, 'error');
      return;
    }

    setError(null);
    onSubmit(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setError(null);
          }}
          placeholder="Describe your dream silver jewelry piece... (e.g., 'A delicate silver necklace with a small sapphire pendant, featuring a modern geometric design')"
          className={`
            w-full h-32 p-4 pr-12 rounded-xl border border-platinum bg-white shadow focus:outline-none focus:ring-2 focus:ring-lavender-300 text-charcoal
            ${error ? 'border-red-400' : 'border-platinum'}
          `}
          disabled={isLoading}
          id={inputId}
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 p-1 bg-lavender-100 rounded hover:bg-lavender-200 transition-colors cursor-pointer shadow"
          aria-label="Suggest prompt"
        >
          <Sparkles size={20} className="text-lavender-300" />
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error.message}
        </p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{prompt.length}/500 characters</span>
        <button
          type="submit"
          className="px-6 py-2 bg-lavender-300 text-white rounded-full hover:bg-blue-200 transition-colors font-medium shadow"
          disabled={isLoading}
        >
          {isLoading ? 'Dreaming...' : 'Dream'}
        </button>
      </div>
    </form>
  );
};

export default PromptInput;