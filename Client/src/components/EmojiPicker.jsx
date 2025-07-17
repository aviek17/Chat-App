import React, { useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerComponent = ({ 
  isOpen, 
  onClose, 
  onEmojiSelect, 
  theme, 
  colors,
  position = 'bottom-right' 
}) => {
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Close picker on Escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-full mb-2 left-4';
      case 'bottom-right':
        return 'bottom-full mb-2 right-4';
      case 'top-left':
        return 'top-full mt-2 left-4';
      case 'top-right':
        return 'top-full mt-2 right-4';
      default:
        return 'bottom-full mb-2 right-4';
    }
  };

  const currentColors = {
    background: colors.background[theme],
    text: colors.text[theme],
    chat: colors.chat[theme]
  };

  const pickerStyle = {
    backgroundColor: currentColors.background.elevated,
    borderRadius: '12px',
    boxShadow: theme === 'light' 
      ? '0 4px 20px rgba(0, 0, 0, 0.15)' 
      : '0 4px 20px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#383838'}`
  };

  return (
    <div 
      ref={pickerRef}
      className={`absolute z-50 ${getPositionClasses()}`}
      style={pickerStyle}
    >
      <EmojiPicker
        onEmojiClick={onEmojiSelect}
        theme={theme}
        width={300}
        height={400}
        searchDisabled={false}
        skinTonesDisabled={false}
        previewConfig={{
          showPreview: true,
          defaultEmoji: "1f60a",
          defaultCaption: "Choose your emoji"
        }}
        autoFocusSearch={true}
        lazyLoadEmojis={true}
        suggestedEmojisMode="recent"
        searchPlaceholder="Search emojis..."
        categories={[
          {
            name: 'Smileys & People',
            category: 'smileys_people'
          },
          {
            name: 'Animals & Nature',
            category: 'animals_nature'
          },
          {
            name: 'Food & Drink',
            category: 'food_drink'
          },
          {
            name: 'Activities',
            category: 'activities'
          },
          {
            name: 'Travel & Places',
            category: 'travel_places'
          },
          {
            name: 'Objects',
            category: 'objects'
          },
          {
            name: 'Symbols',
            category: 'symbols'
          },
          {
            name: 'Flags',
            category: 'flags'
          }
        ]}
      />
    </div>
  );
};

export default EmojiPickerComponent;