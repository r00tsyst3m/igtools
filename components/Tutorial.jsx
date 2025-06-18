import React from 'react';

function Tutorial() {
  const steps = [
    {
      title: "Open Instagram on Desktop",
      description: "Go to instagram.com and log into your account using a web browser (Chrome, Firefox, Safari, etc.)",
      icon: "🌐"
    },
    {
      title: "Access Your Profile",
      description: "Click on your profile picture in the top right corner, then select 'Profile' from the dropdown menu",
      icon: "👤"
    },
    {
      title: "Go to Settings",
      description: "Click on the gear icon (⚙️) or 'Settings' option in your profile menu",
      icon: "⚙️"
    },
    {
      title: "Find Privacy and Security",
      description: "Look for 'Privacy and Security' or 'Account Privacy' in the settings menu",
      icon: "🔒"
    },
    {
      title: "Request Data Download",
      description: "Scroll down to find 'Request Download' or 'Download Your Information' option and click on it",
      icon: "📥"
    },
    {
      title: "Select Data Format",
      description: "Choose 'JSON' as the format for your data download (not HTML)",
      icon: "📄"
    },
    {
      title: "Submit Request",
      description: "Enter your password when prompted and submit the download request",
      icon: "✅"
    },
    {
      title: "Wait for Email",
      description: "Instagram will send you an email with a download link (usually takes 24-48 hours)",
      icon: "📧"
    },
    {
      title: "Download and Extract",
      description: "Click the link in the email, download the ZIP file, and extract it to find the JSON files",
      icon: "📦"
    }
  ];

  return (
    <div className="glass-morphism rounded-2xl p-8 mb-8 animate-slide-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          📱 How to Download Your Instagram Data
        </h2>
        <p className="text-gray-200 text-lg">
          Follow these steps to get your Instagram follower data in JSON format
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="step-number">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{step.icon}</span>
                <h3 className="text-xl font-semibold text-white">
                  {step.title}
                </h3>
              </div>
              <p className="text-gray-200 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="text-lg font-semibold text-yellow-200 mb-2">Important Notes:</h4>
            <ul className="text-yellow-100 space-y-1 text-sm">
              <li>• The download process can take 24-48 hours</li>
              <li>• Make sure to select JSON format, not HTML</li>
              <li>• You'll need the "followers.json" and "following.json" files</li>
              <li>• Keep your data secure and don't share it with others</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Tutorial = Tutorial;
