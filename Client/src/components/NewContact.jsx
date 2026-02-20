import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { UserRound, CircleUser, Smartphone, X, User } from 'lucide-react';
import { colors } from '../styles/theme';
import { addNewContact, getuserOnPhoneNumber } from '../services/user.service';
import { getBase64FromFile, getStaticImageUrl } from '../services/common.service';


const SuggestionItem = React.memo(({ suggestion, isSelected, onClick }) => {
  if (!suggestion?.displayName) return null;

  return (
    <div
      className={`px-3 py-2 cursor-pointer flex items-center gap-2 ${isSelected
        ? 'bg-[#005498] text-white'
        : 'hover:bg-gray-100'
        }`}
      onClick={onClick}
    >
      <User size={14} className='text-gray-400' />
      <div className='flex-1'>
        <div className='text-[15px] font-medium'>
          {suggestion.displayName}
        </div>
        <div className='text-[12px] text-gray-500'>
          {suggestion.phoneNumber}
        </div>
      </div>
    </div>
  );
});
const NewContactContainer = ({ isOpen, onClose }) => {
  const [selectedMode, setSelectedMode] = useState('phoneNumber');
  const [userNameValue, setUserNameValue] = useState('');
  const [phoneNumberValue, setPhoneNumberValue] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedContact, setSelectedContact] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const userNameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const theme = useSelector((state) => state.theme.themeMode);

  const currentColors = useMemo(() => ({
    background: colors.background[theme],
    text: colors.text[theme],
    chat: colors.chat[theme]
  }), [theme]);

  const debouncedSearch = useCallback(async (query) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (query.length >= 5) {
        console.log(query)
        setLoading(true);
        try {
          const results = await getuserOnPhoneNumber({ phoneNumber: query });
          const filteredResults = results.users.filter(user => user.displayName);
          setSuggestions(filteredResults);
          setShowSuggestions(true);
        } catch (error) {
          setShowSuggestions(true);
          setUserNameValue('');
          setBio('');
          setProfilePicture('');
          setSuggestions([]);
          setSelectedContact({});
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  }, [selectedMode]);

  const handleInputChange = useCallback((value, type) => {
    if (type === 'userName') {
      setUserNameValue(value);
    } else {
      setPhoneNumberValue(value);
    }
    setSelectedIndex(-1);
    if (type === selectedMode) {
      debouncedSearch(value);
    }
  }, [selectedMode, debouncedSearch]);

  const selectSuggestion = useCallback((suggestion) => {
    setSelectedContact(suggestion);
    setUserNameValue(suggestion.displayName);
    setPhoneNumberValue(suggestion.phoneNumber);
    setBio(suggestion.bio);
    setProfilePicture(suggestion.profilePicture.filename);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    (selectedMode === 'userName' ? userNameInputRef : phoneInputRef).current?.focus();
  }, [selectedMode]);

  const clearFields = useCallback(() => {
    setPhoneNumberValue('');
    setUserNameValue('');
    setBio('');
    setProfilePicture('');
    setSuggestions([]);
    setSelectedContact({});
    setShowSuggestions(false);
    (selectedMode === 'userName' ? userNameInputRef : phoneInputRef).current?.focus();
  }, [selectedMode]);


  const handleAddContact = async () => {
    let payload = {
      contactUserId: selectedContact._id,
      sourceValue: selectedContact.phoneNumber,
      sourceType: "phone"
    }
    try {
      const response = await addNewContact(payload);
      if (response.success) {
        //
      }
    } catch (err) {
      console.log(err)
    } finally {
      onClose();
      clearFields();
    }
  }


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !userNameInputRef.current?.contains(event.target) &&
        !phoneInputRef.current?.contains(event.target) &&
        !suggestionsRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const isAddDisabled = !userNameValue;
  const currentValue = phoneNumberValue;
  const shouldShowNoResults = showSuggestions && currentValue.length >= 2 && suggestions.length === 0 && !loading;

  if (!isOpen) return null;

  return (
    <>
      <div className='absolute top-0 left-0 h-screen w-screen bg-black/5 backdrop-blur-xs z-10'></div>
      <div className="fixed inset-0 z-10" onClick={onClose}>
        <div
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto w-[400px] rounded-lg bg-[#ffffff] p-[20px] flex flex-col gap-[16px]'
          style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className='text-[20px] text-[#000] font-normal'>New Contact</div>

          <div className="flex items-center justify-center border border-[#b1b0b0] bg-[#b1b0b0] rounded-full w-16 h-16 mx-auto">
            {
              profilePicture ? (<>
                <img src={getStaticImageUrl(profilePicture)} alt="" className="w-full h-full object-cover rounded-full" />
              </>) : <UserRound size={30} style={{ color: "#fff" }} />
            }

          </div>

          <div className='mt-1 relative'>
            <label className='text-[14px] font-[400] text-[#919191]'>
              {selectedMode === 'userName' ? 'User Name' : 'Phone Number'}
            </label>
            <div className='relative'>
              <input
                ref={selectedMode === 'userName' ? userNameInputRef : phoneInputRef}
                type={selectedMode === 'phone' ? 'number' : 'text'}
                value={currentValue}
                onChange={(e) => handleInputChange(e.target.value, selectedMode)}
                // onKeyDown={handleKeyDown}
                placeholder={selectedMode === 'userName' ? 'Start typing username' : 'Enter phone number...'}
                className={`px-3 pr-8 mt-[5px] bg-gray-100 text-gray-800 h-[40px] text-[15px] rounded border-b border-[#e0e0e0] focus:outline-none focus:ring-0 focus:border-b-2 focus:border-[#005498] w-full ${selectedMode === 'phone' ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : ''
                  }`}
                autoComplete='off'
              />

              {currentValue && (
                <button
                  onClick={clearFields}
                  className='absolute right-2 top-[55%] transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  <X size={12} />
                </button>
              )}

              {loading && (
                <div className='absolute right-8 top-[50%] transform -translate-y-1/2'>
                  <div className='animate-spin rounded-full h-3 w-3 border-b border-[#005498]'></div>
                </div>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className='absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto'
              >
                {suggestions.map((suggestion, index) => (
                  <SuggestionItem
                    key={`${suggestion.email}-${index}`}
                    suggestion={suggestion}
                    isSelected={index === selectedIndex}
                    onClick={() => selectSuggestion(suggestion)}
                  />
                ))}
              </div>
            )}

            {shouldShowNoResults && (
              <div className='absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 px-3 py-2'>
                <div className='text-[15px] text-gray-500'>No contacts found</div>
              </div>
            )}
          </div>

          <div className='mt-1'>
            <label className='text-[14px] font-[400] text-[#919191]'>
              {selectedMode === "userName" ? "Phone Number" : "User Name"}
            </label>
            <input
              type='text'
              value={selectedMode === "userName" ? phoneNumberValue : userNameValue}
              disabled
              placeholder='User Name'
              className='px-3 mt-[5px] bg-[#e7e7e7] text-gray-800 h-[40px] text-[15px] rounded border-b border-[#e0e0e0] focus:outline-none focus:ring-0 focus:border-b-2 w-full cursor-not-allowed'
            />
          </div>

          <div className='mt-1'>
            <label className='text-[14px] font-[400] text-[#919191]'>
              User's Bio
            </label>
            <input
              type='text'
              value={bio}
              disabled
              placeholder='Bio'
              className='px-3 mt-[5px] bg-[#e7e7e7] text-gray-800 h-[40px] text-[15px] rounded border-b border-[#e0e0e0] focus:outline-none focus:ring-0 focus:border-b-2 w-full cursor-not-allowed'
            />
          </div>

          {/* <div className='mt-1'>
            <label className='text-[14px] font-[400] text-[#919191]'>First Name</label>
            <input
              type='text'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className='px-3 mt-[5px] bg-gray-100 text-gray-800 h-[40px] text-[15px] rounded border-b border-[#e0e0e0] focus:outline-none focus:ring-0 focus:border-b-2 focus:border-[#005498] w-full'
            />
          </div> */}

          {/* <div className='mt-1'>
            <label className='text-[14px] font-[400] text-[#919191]'>Last Name</label>
            <input
              type='text'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className='px-3 mt-[5px] bg-gray-100 text-gray-800 h-[40px] text-[15px] rounded border-b border-[#e0e0e0] focus:outline-none focus:ring-0 focus:border-b-2 focus:border-[#005498] w-full'
            />
          </div> */}

          <div className='flex gap-2 mt-4'>
            <button
              onClick={onClose}
              className='flex-1 px-4 py-2 text-[15px] cursor-pointer border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              onClick={handleAddContact}
              className='flex-1 px-4 py-2 text-[15px] cursor-pointer bg-[#005498] text-white rounded-md hover:bg-[#004080] disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={isAddDisabled}
            >
              Add Friend
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewContactContainer;