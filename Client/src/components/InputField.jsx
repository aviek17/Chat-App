// FILE: InputField.jsx
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { colors } from '../styles/theme';

const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  showPassword,
  togglePassword,
  error,
  isDark
}) => {
  return (
    <div className="relative mb-6">
      <div className="relative">
        <Icon
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        />
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          style={{
            backgroundColor: isDark ? colors.background.dark.paper : colors.background.light.paper,
            color: isDark ? colors.text.dark.primary : colors.text.light.primary
          }}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePassword}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
              isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-500 animate-pulse">{error}</p>}
    </div>
  );
};

export default InputField;