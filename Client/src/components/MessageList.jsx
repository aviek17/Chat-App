import React, { useCallback, useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { MessageEvents } from '../sockets/events/message';
import { useSocket } from '../sockets/hooks/useSocket';

const MessageList = ({ messages, theme, colors, onNewMessage }) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const { isConnected } = useSocket();

  const currentColors = {
    background: colors.background[theme],
    text: colors.text[theme],
    chat: colors.chat[theme]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Hide scrollbar after 1 second of no scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  // Create stable reference for the socket event handler
  const handleNewMessage = useCallback((message) => {

    // Call the parent's handler
    if (onNewMessage) {
      onNewMessage(message);
    } else {
      console.warn(' MessageList: No onNewMessage handler provided by parent');
    }
  }, [onNewMessage]);

  // Register socket event listener with better debugging
  useEffect(() => {
    console.log('MessageList useEffect triggered:', {
      isConnected,
      hasOnNewMessage: !!onNewMessage,
      handleNewMessageRef: !!handleNewMessage
    });

    if (!isConnected) {
      return;
    }

    MessageEvents.onNewMessage(handleNewMessage);

    return () => {
      MessageEvents.offNewMessage(handleNewMessage);
    };
  }, [isConnected, handleNewMessage]);

  // Additional debugging effect to monitor socket state
  useEffect(() => {
    console.log('MessageList: Socket state changed:', {
      isConnected,
      socketId: window.socketManager?.socket?.id || 'no socket'
    });
  }, [isConnected]);

  const formatMessageDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach(message => {
      const date = formatMessageDate(message.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div
      ref={messagesContainerRef}
      className={`overflow-y-auto p-4 h-[calc(100vh-180px)]
      }`}
      style={{
        backgroundColor: currentColors.background.secondary,
        backgroundImage: theme === 'light'
          ? 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f0f0f0" fill-opacity="0.3"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          : 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23333333" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
      }}
      onScroll={handleScroll}
    >
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="mb-6">
          {/* Date separator */}
          <div className="flex justify-center mb-4">
            <div
              className="px-3 py-1 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: currentColors.background.elevated,
                color: currentColors.text.secondary
              }}
            >
              {date}
            </div>
          </div>

          {/* Messages for this date */}
          {dateMessages.map((message, index) => (
            <MessageBubble
              key={message.id || index}
              message={message}
              theme={theme}
              colors={colors}
            />
          ))}
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;