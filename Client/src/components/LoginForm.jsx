
import React, { useState } from 'react';
import { Sun, Moon, MessageCircle, Mail, Lock, ArrowRight } from 'lucide-react';
import InputField from './InputField.jsx';
import SuccessModal from './SuccessModal.jsx';
import ChatLoginSVG from './ChatLoginSVG.jsx';
import { colors } from '../styles/theme.js';
import Logo from '../assets/Logo_Nobg.png'; // Assuming you have a logo image in your assets folder
import LeftSectionImage from "../assets/Designer.svg"
import { useNavigate } from 'react-router-dom';
import { login } from '../services/user.service.js';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/slice/authSlice.js';
import ErrorModal from './ErrorModal.jsx';
import { AuthEvents } from '../sockets/events/auth.js';
import { setProfilePhotoFileName, setUserInfo } from '../store/slice/userInfoSlice.js';
const LoginForm = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [isDark, setIsDark] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState({
        open: false,
        message: ''
    });

    // Form states
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        return newErrors;
    };

    const showError = (message) => {
        setError({ open: true, message });
    };

    const hideError = () => {
        setError({ open: false, message: '' });
    };


    const handleSubmit = async () => {
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {

            const response = await login(formData);
            if (response.token) {
                dispatch(setUserInfo(response.user));
                dispatch(setToken(response.token));
                dispatch(setProfilePhotoFileName(response?.user?.profilePicture));
                setShowSuccessModal(true);
            }

        } catch (error) {
            console.error('Authentication error:', error);
            showError(`Authentication error:  ${error.message}`);
            setErrors({ general: 'An error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle password reset
    const handleForgotPassword = () => {
        if (!formData.email) {
            setErrors({ email: 'Please enter your email address first' });
            return;
        }

        // Simulate password reset
        console.log('Password reset requested for:', formData.email);
        alert('Password reset link sent to your email!');
    };

    // Handle modal close
    const handleModalClose = () => {
        setShowSuccessModal(false);
        setFormData({ email: '', password: '' });
        setErrors({});
    };

    return (
        <div
            className="min-h-screen flex flex-col lg:flex-row transition-colors duration-300"
            style={{
                backgroundColor: isDark ? colors.background.dark.primary : colors.background.light.primary
            }}
        >
            {/* Theme Toggle */}
            <button
                onClick={() => setIsDark(!isDark)}
                className="fixed top-4 right-4 z-50 p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                style={{
                    backgroundColor: isDark ? colors.background.dark.paper : colors.background.light.paper,
                    color: isDark ? colors.text.dark.primary : colors.text.light.primary
                }}
            >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Left Side - Animated SVG */}
            <div
                className="w-full lg:w-1/2 flex items-center justify-center relative overflow-hidden min-h-screen"
                style={{
                    backgroundColor: isDark ? colors.background.dark.secondary : colors.background.light.secondary
                }}
            >
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.light} 100%)`
                    }}
                />
                <div className="relative z-10 w-full max-w-lg">
                    {/* <ChatLoginSVG isDark={isDark} /> */}
                    <img src={LeftSectionImage} alt="" />
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">

                        <div className="mb-2 flex  justify-center">
                            <img
                                src={Logo}
                                alt="ChatConnect Logo"
                                className="h-20"
                            />
                        </div>
                        <p
                            className="text-sm"
                            style={{ color: isDark ? colors.text.dark.secondary : colors.text.light.secondary }}
                        >
                            Connect, Chat, Communicate
                        </p>
                    </div>

                    {/* Form Header */}
                    <div className="text-center mb-8">
                        <h2
                            className="text-3xl font-bold mb-2"
                            style={{ color: isDark ? colors.text.dark.primary : colors.text.light.primary }}
                        >
                            Welcome Back
                        </h2>
                        <p
                            style={{ color: isDark ? colors.text.dark.secondary : colors.text.light.secondary }}
                        >
                            Sign in to continue your conversations
                        </p>
                    </div>

                    {/* General Error */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {errors.general}
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-6">
                        <InputField
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            icon={Mail}
                            error={errors.email}
                            isDark={isDark}
                        />

                        <InputField
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            icon={Lock}
                            showPassword={showPassword}
                            togglePassword={() => setShowPassword(!showPassword)}
                            error={errors.password}
                            isDark={isDark}
                        />

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm transition-colors duration-300 hover:underline"
                                style={{ color: colors.primary.main }}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{
                                backgroundColor: colors.primary.main,
                                transform: isLoading ? 'scale(0.98)' : 'scale(1)'
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In to Chat
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Switch to Register */}
                    <div className="mt-8 text-center">
                        <p
                            className="mb-4"
                            style={{ color: isDark ? colors.text.dark.secondary : colors.text.light.secondary }}
                        >
                            New to ChatConnect?
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                nav("/register")
                            }}
                            className="font-semibold transition-colors duration-300 hover:underline"
                            style={{ color: colors.primary.main }}
                        >
                            Create New Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleModalClose}
                isLogin={true}
                userEmail={formData.email}
            />

            <ErrorModal
                open={error.open}
                onClose={hideError}
                message={error.message}
                isDarkMode={isDark}
                title="Error"
                showIcon={true}
                confirmText="OK"
                showCloseButton={true}
            />
        </div>
    );
};

export default LoginForm;
