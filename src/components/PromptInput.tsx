import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { validatePrompt, ValidationError } from '../utils/validation';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

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
    <motion.form
      className="flex items-center bg-white rounded-lg shadow-soft px-4 py-3 space-x-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
    >
      <motion.input
        id={inputId}
        type="text"
        className="flex-1 border-none outline-none bg-transparent text-lg font-serif placeholder-gray-400"
        placeholder="Describe your dream jewelry..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        disabled={isLoading}
        whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #b6b6e5' }}
      />
      <motion.button
        type="submit"
        className="px-6 py-2 rounded-lg bg-primary-600 text-white font-semibold text-lg shadow-md hover:bg-primary-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        disabled={isLoading || !prompt.trim()}
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </motion.button>
    </motion.form>
  );
};

export default PromptInput;