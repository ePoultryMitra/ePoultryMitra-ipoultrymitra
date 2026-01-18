
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-6 text-center">
      <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center mb-8 border-4 border-orange-500 overflow-hidden">
        <img 
          src="https://picsum.photos/id/1025/200/200" 
          alt="Poultry Logo" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <h1 className="text-4xl font-extrabold text-orange-600 mb-2">
        Poultry Mitra
      </h1>
      <p className="text-xl text-slate-700 font-medium mb-8">
        आपका डिजिटल मुर्गी पालन सहायक
      </p>
      
      <div className="max-w-md bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          How can Poultry Mitra help you?
        </h2>
        <ul className="text-left space-y-3 text-slate-600">
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">✓</span>
            <span>Real-time health advice (स्वास्थ्य सलाह)</span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">✓</span>
            <span>Farm records management (फार्म रिकॉर्ड)</span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">✓</span>
            <span>Market rates & trends (बाज़ार भाव)</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onStart}
        className="px-10 py-4 bg-orange-500 text-white font-bold rounded-full text-lg shadow-lg hover:bg-orange-600 transition-colors transform active:scale-95"
      >
        Get Started / शुरू करें
      </button>
      
      <p className="mt-8 text-slate-400 text-sm">
        Helping farmers grow since 2024
      </p>
    </div>
  );
};
