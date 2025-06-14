interface Config {
  apiUrl: string;
  appName: string;
  appDescription: string;
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  appName: import.meta.env.VITE_APP_NAME || 'JewelKraft AI',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Transform Your Words into Exquisite Jewelry'
};

export default config; 