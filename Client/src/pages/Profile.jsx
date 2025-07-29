import React, { useState, useRef, useEffect } from 'react';
import { User, Camera, Mail, Phone, MessageSquare, Edit3, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { colors } from '../styles/theme';

const Profile = () => {
    // Mock theme state - in real app this would come from Redux
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        email: 'user@example.com',
        username: 'johndoe',
        displayName: 'John Doe',
        countryCode: '+1',
        phoneNumber: '234 567 8900',
        bio: 'Software developer passionate about creating amazing user experiences. Love to code, travel, and learn new technologies.'
    });

    const [originalData, setOriginalData] = useState({ ...formData });
    const [profileImage, setProfileImage] = useState(null);
    const [showUploadHint, setShowUploadHint] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);


    // Country codes data
    const countryCodes = [
        { code: '+1', country: 'United States', flag: '🇺🇸', iso: 'US' },
        { code: '+44', country: 'United Kingdom', flag: '🇬🇧', iso: 'GB' },
        { code: '+91', country: 'India', flag: '🇮🇳', iso: 'IN' },
        { code: '+86', country: 'China', flag: '🇨🇳', iso: 'CN' },
        { code: '+49', country: 'Germany', flag: '🇩🇪', iso: 'DE' },
        { code: '+33', country: 'France', flag: '🇫🇷', iso: 'FR' },
        { code: '+81', country: 'Japan', flag: '🇯🇵', iso: 'JP' },
        { code: '+82', country: 'South Korea', flag: '🇰🇷', iso: 'KR' },
        { code: '+61', country: 'Australia', flag: '🇦🇺', iso: 'AU' },
        { code: '+55', country: 'Brazil', flag: '🇧🇷', iso: 'BR' },
        { code: '+34', country: 'Spain', flag: '🇪🇸', iso: 'ES' },
        { code: '+39', country: 'Italy', flag: '🇮🇹', iso: 'IT' },
        { code: '+7', country: 'Russia', flag: '🇷🇺', iso: 'RU' },
        { code: '+52', country: 'Mexico', flag: '🇲🇽', iso: 'MX' },
        { code: '+27', country: 'South Africa', flag: '🇿🇦', iso: 'ZA' }
    ];

    const theme = isDarkMode ? 'dark' : 'light';
    const bgColors = colors.background[theme];
    const textColors = colors.text[theme];

    // Handle outside click to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            setShowCountryDropdown(false);
            setSearchTerm('');
        } else if (event.key === 'Enter' && showCountryDropdown) {
            const firstMatch = filteredCountries[0];
            if (firstMatch) {
                handleCountryCodeSelect(firstMatch.code);
            }
        }
    };

    // Filter countries based on search term
    const filteredCountries = countryCodes.filter(country =>
        country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.includes(searchTerm) ||
        country.iso.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCountryCodeSelect = (code) => {
        setFormData(prev => ({ ...prev, countryCode: code }));
        setShowCountryDropdown(false);
        setSearchTerm('');
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setOriginalData({ ...formData });
        alert('Profile updated successfully!');
    };

    const handleDiscard = () => {
        setFormData({ ...originalData });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };



    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);

    return (
        <div
            className=" transition-all duration-300"
            style={{ backgroundColor: bgColors.primary }}
        >
            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h1
                        className="text-3xl font-bold mb-2 transition-colors duration-300"
                        style={{ color: textColors.primary }}
                    >
                        Profile Settings
                    </h1>
                    <p
                        className="text-base transition-colors duration-300"
                        style={{ color: textColors.secondary }}
                    >
                        Manage your account information and preferences
                    </p>
                </div>

                <div
                    className="rounded-2xl p-8 transition-all duration-300 shadow-lg"
                    style={{ backgroundColor: bgColors.paper }}
                >
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Left Section - Profile Photo */}
                        <div className="lg:w-1/3 h-full flex flex-col">
                            {/* Fixed height heading */}
                            <h2
                                className="text-xl font-semibold mb-6 transition-colors duration-300"
                                style={{ color: textColors.primary }}
                            >
                                Profile Photo
                            </h2>

                            {/* This takes the remaining space */}
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div
                                    className="relative group cursor-pointer"
                                    onMouseEnter={() => setShowUploadHint(true)}
                                    onMouseLeave={() => setShowUploadHint(false)}
                                >
                                    <div
                                        className="w-48 h-48 rounded-3xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-lg"
                                        style={{
                                            backgroundColor: profileImage ? 'transparent' : bgColors.elevated,
                                            border: isDarkMode ? `3px solid ${colors.text.dark.primary}` : `3px solid ${colors.text.light.primary}`,
                                        }}
                                    >
                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="Profile"
                                                className="w-full h-full rounded-3xl object-cover"
                                            />
                                        ) : (
                                            <User
                                                size={72}
                                                style={{  color: isDarkMode ? colors.text.dark.primary : colors.text.light.primary}}
                                            />
                                        )}
                                    </div>

                                    {/* Upload Overlay */}
                                    <div
                                        className={`absolute inset-0 rounded-3xl flex items-center justify-center transition-all duration-300 ${showUploadHint ? 'bg-black bg-opacity-60' : 'bg-transparent'
                                            }`}
                                    >
                                        {showUploadHint && (
                                            <div className="text-center">
                                                <Camera size={32} className="text-white mx-auto mb-2" />
                                                <p className="text-white text-sm font-medium">Update Photo</p>
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>

                                <p
                                    className="text-sm mt-6 text-center transition-colors duration-300"
                                    style={{ color: textColors.secondary }}
                                >
                                    Click to upload a new photo
                                    <br />
                                    <span className="text-xs">JPG, PNG up to 5MB</span>
                                </p>
                            </div>
                        </div>


                        {/* Right Section - Form */}
                        <div className="lg:w-2/3">
                            <h2
                                className="text-xl font-semibold mb-8 transition-colors duration-300"
                                style={{ color: textColors.primary }}
                            >
                                Account Information
                            </h2>

                            <div className="space-y-6">

                                {/* Display Name - Editable */}
                                <div className="flex flex-col h-full"> {/* or h-screen depending on your container */}
                                    <h2 className="text-xl font-semibold mb-6" style={{ color: textColors.primary }}>
                                        Display Name
                                    </h2>

                                    <div className="flex-1 flex items-center"> {/* This takes remaining height and centers vertically */}
                                        <input
                                            type="text"
                                            value={formData.displayName}
                                            onChange={(e) => handleInputChange('displayName', e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                            style={{
                                                    backgroundColor: isDarkMode ? colors.background.dark.paper : colors.background.light.paper,
                                                    color: isDarkMode ? colors.text.dark.primary : colors.text.light.primary
                                                }}
                                            placeholder="Enter your display name"
                                        />
                                    </div>
                                </div>

                                {/* Phone Number with Country Code - Editable */}
                                <div>
                                    <label
                                        className="block text-sm font-semibold mb-3 transition-colors duration-300"
                                        style={{ color: textColors.primary }}
                                    >
                                        Phone Number
                                    </label>
                                    <div className="flex gap-3">
                                        {/* Custom Country Code Select */}
                                        <div className="relative" ref={dropdownRef}>
                                            <button
                                                type="button"
                                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                                onKeyDown={handleKeyDown}
                                                className="flex items-center gap-2 px-4 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-md min-w-[140px]"
                                                style={{
                                                    backgroundColor: isDarkMode ? colors.background.dark.paper : colors.background.light.paper,
                                                    color: isDarkMode ? colors.text.dark.primary : colors.text.light.primary
                                                }}
                                                aria-expanded={showCountryDropdown}
                                                aria-haspopup="listbox"
                                                aria-label="Select country code"
                                            >
                                                <span className="text-lg">{selectedCountry?.flag}</span>
                                                <span className="font-mono text-sm">{formData.countryCode}</span>
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform duration-300 ${showCountryDropdown ? 'rotate-180' : ''}`}
                                                    style={{  color: isDarkMode ? colors.text.dark.primary : colors.text.light.primary }}
                                                />
                                            </button>

                                            {/* Advanced Dropdown Menu */}
                                            {showCountryDropdown && (
                                                <div
                                                    className="absolute top-full left-0 mt-2 w-80 rounded-xl border shadow-2xl z-50 overflow-hidden"
                                                    style={{
                                                        backgroundColor: bgColors.paper,
                                                        borderColor: isDarkMode ? '#34495e' : '#d1d5db'
                                                    }}
                                                    role="listbox"
                                                    aria-label="Country codes"
                                                >
                                                    {/* Search Input */}
                                                    <div className="p-3 border-b" style={{ borderColor: isDarkMode ? '#34495e' : '#e5e7eb' }}>
                                                        <input
                                                            type="text"
                                                            placeholder="Search country or code..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            onKeyDown={handleKeyDown}
                                                            autoFocus
                                                            className="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 text-sm"
                                                            style={{
                                                                backgroundColor: isDarkMode ? colors.background.dark.paper : colors.background.light.paper,
                                                                color: isDarkMode ? colors.text.dark.primary : colors.text.light.primary
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Options List */}
                                                    <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                                        {filteredCountries.length > 0 ? (
                                                            filteredCountries.map((country, index) => (
                                                                <button
                                                                    key={country.code}
                                                                    onClick={() => handleCountryCodeSelect(country.code)}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:scale-[1.02] group"
                                                                    style={{
                                                                        backgroundColor: isDarkMode ? colors.background.dark.paper : colors.background.light.paper,
                                                                        color: isDarkMode ? colors.text.dark.primary : colors.text.light.primary
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        if (country.code !== formData.countryCode) {
                                                                            e.target.style.backgroundColor = isDarkMode ? '#374151' : '#f9fafb';
                                                                        }
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        if (country.code !== formData.countryCode) {
                                                                            e.target.style.backgroundColor = 'transparent';
                                                                        }
                                                                    }}
                                                                    role="option"
                                                                    aria-selected={country.code === formData.countryCode}
                                                                >
                                                                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                                                                        {country.flag}
                                                                    </span>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-mono text-sm font-semibold">
                                                                                {country.code}
                                                                            </span>
                                                                            <span className="text-xs opacity-75 font-medium">
                                                                                {country.iso}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-sm opacity-80 truncate">
                                                                            {country.country}
                                                                        </div>
                                                                    </div>
                                                                    {country.code === formData.countryCode && (
                                                                        <div className="w-2 h-2 rounded-full bg-current opacity-75"></div>
                                                                    )}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-6 text-center" style={{ color: textColors.secondary }}>
                                                                <div className="text-2xl mb-2">🔍</div>
                                                                <div className="text-sm">No countries found</div>
                                                                <div className="text-xs opacity-75">Try a different search term</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Phone Number Input */}
                                        <div className="relative flex-1">
                                            <Phone size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{  color: isDarkMode ? colors.text.dark.primary : colors.text.light.primary }} />
                                            <input
                                                type="tel"
                                                value={formData.phoneNumber}
                                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                                style={{
                                                    backgroundColor: isDarkMode ? colors.background.dark.paper : colors.background.light.paper,
                                                    color: isDarkMode ? colors.text.dark.primary : colors.text.light.primary
                                                }}
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bio - Editable */}
                                <div>
                                    <label
                                        className="block text-sm font-semibold mb-3 transition-colors duration-300"
                                        style={{ color: textColors.primary }}
                                    >
                                        Bio
                                    </label>
                                    <div className="relative">
                                        <MessageSquare size={20} className="absolute left-4 top-4" style={{ color: isDarkMode ? colors.text.dark.primary : colors.text.light.primary }} />
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => handleInputChange('bio', e.target.value)}
                                            rows={4}
                                            className="w-full pl-12 pr-4 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 resize-none"
                                            style={{
                                                backgroundColor: isDarkMode ? colors.background.dark.paper : colors.background.light.paper,
                                                color: isDarkMode ? colors.text.dark.primary : colors.text.light.primary
                                            }}
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleDiscard}
                        disabled={!hasChanges}
                        className="px-8 py-4 rounded-xl border transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover:shadow-md font-semibold"
                        style={{
                            backgroundColor: bgColors.paper,
                            borderColor: isDarkMode ? '#34495e' : '#d1d5db',
                            color: textColors.primary
                        }}
                    >
                        Discard Changes
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="px-8 py-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover:shadow-lg font-semibold"
                        style={{
                            backgroundColor: hasChanges ? colors.primary.main : textColors.disabled,
                            color: colors.primary.contrastText
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;