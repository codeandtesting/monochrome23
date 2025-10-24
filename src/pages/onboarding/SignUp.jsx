import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpPage from '../../components/SignUpModal';

export default function SignUp() {
  const navigate = useNavigate();
  return (
    <SignUpPage onComplete={() => navigate('/dashboard')} />
  );
}


