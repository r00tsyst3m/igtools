import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    const checkDependencies = () => {
      if (window.Tutorial && window.FileUpload && window.Results) {
        setIsReady(true);
      }
    };

    checkDependencies();
    const interval = setInterval(checkDependencies, 100);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = (data) => {
    setAnalysisData(data);
  };

  const resetAnalysis = () => {
    setAnalysisData(null);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-white text-lg">Loading Instagram Analyzer...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            📱 Instagram Follower Analyzer
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover who's not following you back on Instagram. Upload your data and get detailed insights about your followers.
          </p>
        </div>

        {/* Main Content */}
        {!analysisData ? (
          <>
            <window.Tutorial />
            <window.FileUpload onAnalyze={handleAnalyze} />
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <button
                onClick={resetAnalysis}
                className="px-6 py-3 bg-gray-500/20 border border-gray-500/30 rounded-xl text-gray-200 hover:bg-gray-500/30 transition-all duration-300 flex items-center space-x-2 mx-auto"
              >
                <span>←</span>
                <span>Analyze New Data</span>
              </button>
            </div>
            <window.Results data={analysisData} />
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-12 p-6 glass-morphism rounded-xl">
          <p className="text-gray-300 mb-2">
            🔒 Your data is processed locally and never sent to any server
          </p>
          <p className="text-gray-400 text-sm">
            This tool helps you understand your Instagram connections better
          </p>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('renderDiv')).render(<App />);
