'use client';

import React, { useState, useEffect } from 'react';
import ProfilePage from '../../../components/ProfilePage';
import api from '../../../services/api';

export default function ProfileRoute() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: 'Loading...',
    role: '...',
    email: '...',
    phone: '...',
    location: '...',
    bio: '...',
    joinDate: '...',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=150'
  });

  useEffect(() => {
    api.getUser().then(user => {
      setCurrentUser(user);
      setUserProfile(prev => ({
        ...prev,
        name: user.name,
        role: user.role,
        email: user.email,
        joinDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      }));
    });
  }, []);

  if (!currentUser) return null;

  return <ProfilePage userProfile={userProfile} setUserProfile={setUserProfile} />;
}
