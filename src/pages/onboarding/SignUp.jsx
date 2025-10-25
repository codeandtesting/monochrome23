import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpPage from '../../components/SignUpModal';

export default function SignUp() {
  const navigate = useNavigate();

  const handleComplete = () => {
    // Set flag for first-time user to show welcome/tutorial
    localStorage.setItem('progressit_first_login', 'true');

    // Redirect to Quick Edit for better onboarding experience
    navigate('/dashboard/quick-edit');
  };

  return (
    <SignUpPage onComplete={handleComplete} />
  );
}


