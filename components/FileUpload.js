import React, { useState, useRef } from 'react';

function FileUpload({ onAnalyze }) {
  const [followersFile, setFollowersFile] = useState(null);
  const [followingFile, setFollowingFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const followersInputRef = useRef(null);
  const followingInputRef = useRef(null);

  const handleFileSelect = (file, type) => {
    if (!file.name.endsWith('.json')) {
      setError('Please select a JSON file');
      return;
    }
    
    setError('');
    if (type === 'followers') {
      setFollowersFile(file);
    } else {
      setFollowingFile(file);
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(file => file.name.endsWith('.json'));
    
    if (jsonFile) {
      handleFileSelect(jsonFile, type);
    } else {
      setError('Please drop a JSON file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const parseJsonFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  const handleAnalyze = async () => {
    if (!followersFile || !followingFile) {
      setError('Please upload both followers.json and following.json files');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [followersData, followingData] = await Promise.all([
        parseJsonFile(followersFile),
        parseJsonFile(followingFile)
      ]);

      // Extract usernames from the JSON structure
      const followers = new Set();
      const following = new Set();

      // Handle different possible JSON structures
      if (Array.isArray(followersData)) {
        followersData.forEach(item => {
          if (item.string_list_data && item.string_list_data[0]) {
            followers.add(item.string_list_data[0].value);
          }
        });
      } else if (followersData.relationships_followers) {
        followersData.relationships_followers.forEach(item => {
          if (item.string_list_data && item.string_list_data[0]) {
            followers.add(item.string_list_data[0].value);
          }
        });
      }

      if (Array.isArray(followingData)) {
        followingData.relationships_following?.forEach(item => {
          if (item.string_list_data && item.string_list_data[0]) {
            following.add(item.string_list_data[0].value);
          }
        });
      } else if (followingData.relationships_following) {
        followingData.relationships_following.forEach(item => {
          if (item.string_list_data && item.string_list_data[0]) {
            following.add(item.string_list_data[0].value);
          }
        });
      }

      // Find users who don't follow back
      const notFollowingBack = Array.from(following).filter(user => !followers.has(user));
      const notFollowingYou = Array.from(followers).filter(user => !following.has(user));

      onAnalyze({
        followers: Array.from(followers),
        following: Array.from(following),
        notFollowingBack,
        notFollowingYou,
        totalFollowers: followers.size,
        totalFollowing: following.size
      });

    } catch (error) {
      setError(`Error analyzing files: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-8 mb-8 animate-slide-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          📁 Upload Your Instagram Data
        </h2>
        <p className="text-gray-200 text-lg">
          Upload your followers.json and following.json files to analyze
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Followers File Upload */}
        <div>
          <label className="block text-white font-semibold mb-3">
            📥 Followers File (followers.json)
          </label>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
              dragOver ? 'border-blue-400 bg-blue-500/20' : 'border-gray-400 hover:border-blue-400'
            } ${followersFile ? 'border-green-400 bg-green-500/20' : ''}`}
            onDrop={(e) => handleDrop(e, 'followers')}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => followersInputRef.current?.click()}
          >
            <input
              ref={followersInputRef}
              type="file"
              accept=".json"
              onChange={(e) => handleFileSelect(e.target.files[0], 'followers')}
              className="hidden"
            />
            {followersFile ? (
              <div className="text-green-300">
                <div className="text-4xl mb-2">✅</div>
                <p className="font-semibold">{followersFile.name}</p>
                <p className="text-sm opacity-75">File uploaded successfully</p>
              </div>
            ) : (
              <div className="text-gray-300">
                <div className="text-4xl mb-2">📁</div>
                <p className="font-semibold mb-1">Drop followers.json here</p>
                <p className="text-sm opacity-75">or click to browse</p>
              </div>
            )}
          </div>
        </div>

        {/* Following File Upload */}
        <div>
          <label className="block text-white font-semibold mb-3">
            📤 Following File (following.json)
          </label>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
              dragOver ? 'border-blue-400 bg-blue-500/20' : 'border-gray-400 hover:border-blue-400'
            } ${followingFile ? 'border-green-400 bg-green-500/20' : ''}`}
            onDrop={(e) => handleDrop(e, 'following')}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => followingInputRef.current?.click()}
          >
            <input
              ref={followingInputRef}
              type="file"
              accept=".json"
              onChange={(e) => handleFileSelect(e.target.files[0], 'following')}
              className="hidden"
            />
            {followingFile ? (
              <div className="text-green-300">
                <div className="text-4xl mb-2">✅</div>
                <p className="font-semibold">{followingFile.name}</p>
                <p className="text-sm opacity-75">File uploaded successfully</p>
              </div>
            ) : (
              <div className="text-gray-300">
                <div className="text-4xl mb-2">📁</div>
                <p className="font-semibold mb-1">Drop following.json here</p>
                <p className="text-sm opacity-75">or click to browse</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200">
          <div className="flex items-center space-x-2">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleAnalyze}
          disabled={!followersFile || !followingFile || loading}
          className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
            !followersFile || !followingFile || loading
              ? 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 animate-pulse-glow'
          }`}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            '🔍 Analyze Followers'
          )}
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
        <div className="flex items-start space-x-3">
          <span className="text-xl">💡</span>
          <div>
            <h4 className="text-lg font-semibold text-blue-200 mb-2">Tips:</h4>
            <ul className="text-blue-100 space-y-1 text-sm">
              <li>• Look for "followers.json" and "following.json" in your downloaded Instagram data</li>
              <li>• Files are usually in the "connections" folder</li>
              <li>• Make sure both files are uploaded before analyzing</li>
              <li>• Your data is processed locally and never sent to any server</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

window.FileUpload = FileUpload;
