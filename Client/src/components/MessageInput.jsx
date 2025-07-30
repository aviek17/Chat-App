import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Mic } from 'lucide-react';
import EmojiPickerComponent from './EmojiPicker';
import { useEmojiPicker } from '../hooks/useEmojiPicker';
import { useSelector } from 'react-redux';
import { MessageEvents } from '../sockets/events/message';

const MessageInput = ({ onSendMessage, theme, colors }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const userInfo = useSelector(state => state?.user?.userInfo);

  const {
    isOpen: isEmojiPickerOpen,
    togglePicker: toggleEmojiPicker,
    closePicker: closeEmojiPicker,
    handleEmojiSelect,
    recentEmojis
  } = useEmojiPicker(textareaRef, message, setMessage);

  const currentColors = {
    background: colors.background[theme],
    text: colors.text[theme],
    chat: colors.chat[theme]
  };

  const inputStyle = {
    backgroundColor: currentColors.chat.inputBackground,
    color: currentColors.text.primary,
    border: `1px solid ${currentColors.chat.inputBorder}`,
    borderRadius: '20px',
    resize: 'none',
    outline: 'none'
  };

  const handleSubmit = (e) => {
    console.log("handleSubmit called");
    e.preventDefault();
    if (message.trim()) {
      // onSendMessage({
      //   type: 'text',
      //   content: message.trim(),
      //   timestamp: new Date().toISOString(),
      //   sender: 'user',
      //   status: 'sent'
      // });
      console.log("new msg ", message.trim());
      onMessageSend(message.trim());
      setMessage('');
      closeEmojiPicker(); // Close emoji picker on send
      if (textareaRef.current) {
        textareaRef.current.style.height = '20px';
      }
    }
  };


  const onMessageSend = (msg) => {
    console.log(userInfo);
    // const socketData = { userId: userInfo?.id };
    const messageContent = { receiverId: "6883caa351d31417050b05cd", content: msg };

    const handleMessageSentSuccessfully = (data) => {
      console.log("Message sent success:", data.message);
    };
    MessageEvents.onMessageSent(handleMessageSentSuccessfully);

    MessageEvents.sendMessage(messageContent);

  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = '20px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleAttachment = () => {
    closeEmojiPicker();
    console.log('Open file picker');
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    closeEmojiPicker();
    console.log('Toggle voice recording');
  };

  return (
    <div
      className="p-4 border-t relative"
      style={{
        backgroundColor: currentColors.background.primary,
        borderColor: theme === 'light' ? '#e0e0e0' : '#383838'
      }}
    >
      <EmojiPickerComponent
        isOpen={isEmojiPickerOpen}
        onClose={closeEmojiPicker}
        onEmojiSelect={handleEmojiSelect}
        theme={theme}
        colors={colors}
        position="bottom-right"
      />

      <form className="flex space-x-3 items-center">
       {/* onSubmit={handleSubmit} */}
        <button
          type="button"
          onClick={handleAttachment}
          className="p-2 rounded-full transition-colors flex-shrink-0"
          style={{
            backgroundColor: 'transparent',
            ':hover': { backgroundColor: currentColors.background.elevated }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = currentColors.background.elevated;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Paperclip size={20} style={{ color: currentColors.text.secondary }} />
        </button>

        <div className="flex-1 relative">
          <button
            type="button"
            onClick={toggleEmojiPicker}
            className={`absolute left-3 top-2 p-1 rounded-full transition-colors ${isEmojiPickerOpen ? 'opacity-100' : 'opacity-70'
              }`}
            style={{
              backgroundColor: isEmojiPickerOpen ? currentColors.background.elevated : 'transparent',
              ':hover': { backgroundColor: currentColors.background.elevated }
            }}
            onMouseEnter={(e) => {
              if (!isEmojiPickerOpen) {
                e.currentTarget.style.backgroundColor = currentColors.background.elevated;
              }
            }}
            onMouseLeave={(e) => {
              if (!isEmojiPickerOpen) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Smile size={18} style={{ color: currentColors.text.secondary }} />
          </button>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full pl-12 pr-4 py-2 text-sm min-h-10 max-h-32 overflow-y-auto"
            style={inputStyle}
            rows="1"
          />
        </div>

        {message.trim() ? (
          <button
            type="submit"
            className="p-2 rounded-full transition-colors flex-shrink-0"
            style={{
              backgroundColor: colors.primary.main,
              color: colors.primary.contrastText
            }}
            onClick={handleSubmit}
          >
            <Send size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleMicClick}
            className={`p-2 rounded-full transition-colors flex-shrink-0 ${isRecording ? 'animate-pulse' : ''
              }`}
            style={{
              backgroundColor: isRecording ? '#ff4444' : colors.primary.main,
              color: colors.primary.contrastText
            }}
          >
            <Mic size={20} />
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageInput;