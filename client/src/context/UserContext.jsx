import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('notenest_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || 'Alex Rivera',
          email: parsed.email || 'alex.rivera@university.edu',
          major: parsed.major || 'Computer Science & AI',
          avatar: parsed.avatar || DEFAULT_AVATAR
        };
      }
    } catch (e) {}
    return {
      name: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      major: 'Computer Science & AI',
      avatar: DEFAULT_AVATAR
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('notenest_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
  }, [profile]);

  const updateProfile = (updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateAvatar = (base64Url) => {
    setProfile((prev) => ({ ...prev, avatar: base64Url }));
  };

  const resetAvatar = () => {
    setProfile((prev) => ({ ...prev, avatar: DEFAULT_AVATAR }));
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, updateAvatar, resetAvatar, defaultAvatar: DEFAULT_AVATAR }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
