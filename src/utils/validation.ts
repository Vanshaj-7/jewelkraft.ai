export interface ValidationError {
  field: string;
  message: string;
}

export const validatePrompt = (prompt: string): ValidationError | null => {
  if (!prompt.trim()) {
    return {
      field: 'prompt',
      message: 'Please enter a description for your jewelry design'
    };
  }

  if (prompt.length < 10) {
    return {
      field: 'prompt',
      message: 'Please provide a more detailed description (minimum 10 characters)'
    };
  }

  if (prompt.length > 500) {
    return {
      field: 'prompt',
      message: 'Description is too long (maximum 500 characters)'
    };
  }

  return null;
};

export const validateProduct = (product: {
  material: string;
  size: string;
  karat: number;
  color: string;
  hallmark: string;
  purity: string;
  weight: string;
  quantity: number;
}): ValidationError | null => {
  if (!product.material) {
    return {
      field: 'material',
      message: 'Please select a material'
    };
  }

  if (!product.size) {
    return {
      field: 'size',
      message: 'Please select a size'
    };
  }

  if (!product.karat) {
    return {
      field: 'karat',
      message: 'Please select a karat'
    };
  }

  if (!product.color) {
    return {
      field: 'color',
      message: 'Please select a color'
    };
  }

  if (!product.hallmark) {
    return {
      field: 'hallmark',
      message: 'Please select a hallmark'
    };
  }

  if (!product.purity) {
    return {
      field: 'purity',
      message: 'Please select a purity'
    };
  }

  if (!product.weight) {
    return {
      field: 'weight',
      message: 'Please select a weight'
    };
  }

  if (product.quantity < 1) {
    return {
      field: 'quantity',
      message: 'Quantity must be at least 1'
    };
  }

  return null;
};

export const validateEmail = (email: string): ValidationError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return {
      field: 'email',
      message: 'Email is required'
    };
  }

  if (!emailRegex.test(email)) {
    return {
      field: 'email',
      message: 'Please enter a valid email address'
    };
  }

  return null;
};

export const validatePassword = (password: string): ValidationError | null => {
  if (!password) {
    return {
      field: 'password',
      message: 'Password is required'
    };
  }

  if (password.length < 8) {
    return {
      field: 'password',
      message: 'Password must be at least 8 characters long'
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      field: 'password',
      message: 'Password must contain at least one uppercase letter'
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      field: 'password',
      message: 'Password must contain at least one lowercase letter'
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      field: 'password',
      message: 'Password must contain at least one number'
    };
  }

  return null;
}; 