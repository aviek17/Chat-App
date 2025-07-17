import { useState, useCallback } from 'react';

export const useEmojiPicker = (textareaRef, message, setMessage) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState([]);

  const openPicker = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closePicker = useCallback(() => {
    setIsOpen(false);
  }, []);

  const togglePicker = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleEmojiSelect = useCallback((emojiData) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;
    
    // Add to recent emojis
    setRecentEmojis(prev => {
      const filtered = prev.filter(e => e !== emoji);
      return [emoji, ...filtered].slice(0, 10); // Keep last 10
    });
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.slice(0, start) + emoji + message.slice(end);
      
      setMessage(newMessage);
      
      // Focus back to textarea and set cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
        
        // Auto-resize textarea if needed
        textarea.style.height = '20px';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }, 0);
    } else {
      setMessage(prev => prev + emoji);
    }
    
    // Optional: Keep picker open or close it
    // closePicker();
  }, [message, setMessage, textareaRef]);

  const insertEmoji = useCallback((emoji) => {
    const textarea = textareaRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.slice(0, start) + emoji + message.slice(end);
      
      setMessage(newMessage);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setMessage(prev => prev + emoji);
    }
  }, [message, setMessage, textareaRef]);

  return {
    isOpen,
    openPicker,
    closePicker,
    togglePicker,
    handleEmojiSelect,
    insertEmoji,
    recentEmojis
  };
};