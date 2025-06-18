import React, { useState } from 'react';

function Results({ data }) {
  const [activeTab, setActiveTab] = useState('notFollowingBack');
  const [searchTerm, setSearchTerm] = useState('');

  if (!data) return null;

  const { 
    notFollowingBack, 
    notFollowingYou, 
    totalFollowers, 
    totalFollowing,
    followers,
    following
  } = data;

  const filterUsers = (users) => {
    return users.filter(user => 
      user.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadList = (users, filename) => {
    const content = users.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    {
      id: 'notFollowingBack',
      label: 'Not Following Back',
      icon: '💔',
      count: notFollowingBack.length,
      data: notFollowingBack,
      description: 'People you follow who don\'t follow you back'
    },
    {
      id: 'notFollowingYou',
      label: 'You Don\'t Follow',
      icon: '👥',
      count: notFollowingYou.length,
      data: notFollowingYou,
      description: 'People who follow you but you don\'t follow back'
    },
    {
      id: 'stats',
      label: 'Statistics',
      icon: '📊',
      count: null,
      data: null,
      description: 'Overview of your follower statistics'
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);
  const filteredUsers = currentTab?.data ? filterUsers(currentTab.data) : [];

  return (
    <div className="glass-morphism rounded-2xl p-8 animate-slide-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          📊 Analysis Results
        </h2>
        <p className="text-gray-200 text-lg">
          Here's what we found in your Instagram data
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">👥</div>
          <div className="text-2xl font-bold text-white">{totalFollowers}</div>
          <div className="text-blue-200 text-sm">Followers</div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">📤</div>
          <div className="text-2xl font-bold text-white">{totalFollowing}</div>
          <div className="text-purple-200 text-sm">Following</div>
        </div>
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">💔</div>
          <div className="text-2xl font-bold text-white">{notFollowingBack.length}</div>
          <div className="text-red-200 text-sm">Don't Follow Back</div>
        </div>
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">💚</div>
          <div className="text-2xl font-bold text-white">
            {Math.round((totalFollowers / totalFollowing) * 100) || 0}%
          </div>
          <div className="text-green-200 text-sm">Follow Back Rate</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-gray-400/30 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-blue-300 border-b-2 border-blue-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' ? (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">📈 Follow Ratio</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Followers to Following Ratio:</span>
                  <span className="text-white font-semibold">
                    {totalFollowing > 0 ? (totalFollowers / totalFollowing).toFixed(2) : '0'}:1
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Follow Back Rate:</span>
                  <span className="text-white font-semibold">
                    {totalFollowing > 0 ? Math.round(((totalFollowing - notFollowingBack.length) / totalFollowing) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Mutual Follows:</span>
                  <span className="text-white font-semibold">
                    {totalFollowing - notFollowingBack.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🎯 Recommendations</h3>
              <div className="space-y-3 text-sm">
                {notFollowingBack.length > totalFollowing * 0.3 && (
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-400">⚠️</span>
                    <span className="text-gray-200">
                      Consider unfollowing some accounts that don't follow back
                    </span>
                  </div>
                )}
                {totalFollowing > totalFollowers * 2 && (
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-400">💡</span>
                    <span className="text-gray-200">
                      You're following significantly more than your followers
                    </span>
                  </div>
                )}
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">✅</span>
                  <span className="text-gray-200">
                    Focus on engaging with accounts that follow you back
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search usernames..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-gray-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(filteredUsers.join('\n'))}
                className="px-4 py-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-200 hover:bg-blue-500/30 transition-all duration-300 flex items-center space-x-2"
              >
                <span>📋</span>
                <span>Copy</span>
              </button>
              <button
                onClick={() => downloadList(filteredUsers, `${activeTab}.txt`)}
                className="px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200 hover:bg-green-500/30 transition-all duration-300 flex items-center space-x-2"
              >
                <span>💾</span>
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-300">
              {currentTab?.description} ({filteredUsers.length} {searchTerm ? 'filtered' : 'total'})
            </p>
          </div>

          {/* User List */}
          <div className="bg-white/5 rounded-xl p-4 max-h-96 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              <div className="grid gap-2">
                {filteredUsers.map((username, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">@{username}</span>
                    </div>
                    <a
                      href={`https://instagram.com/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-200 hover:bg-blue-500/30 transition-all duration-300 text-sm"
                    >
                      View Profile
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? 'No users found matching your search' : 'No users in this category'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

window.Results = Results;
