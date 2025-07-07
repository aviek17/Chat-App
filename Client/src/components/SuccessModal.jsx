// FILE: SuccessModal.jsx
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { colors } from '../styles/theme';

const SuccessModal = ({ isOpen, onClose, isLogin, userEmail }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all duration-300"
        style={{
          backgroundColor: colors.background.light.paper,
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary.main }}
          >
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text.light.primary }}>
            {isLogin ? 'Welcome Back!' : 'Account Created!'}
          </h3>
          <p className="mb-6" style={{ color: colors.text.light.secondary }}>
            {isLogin
              ? `Successfully signed in as ${userEmail}. Redirecting to your chat...`
              : `Your account has been created successfully. Welcome to the chat!`}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-white font-medium transition-colors duration-300"
            style={{ backgroundColor: colors.primary.main }}
          >
            Continue to Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
