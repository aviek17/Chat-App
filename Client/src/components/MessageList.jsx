import React, { memo, useCallback, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useSelector } from 'react-redux';

const MessageList = ({ selectedUserId, theme, colors }) => {
  const messagesEndRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const currentUserId = useSelector(state => state.user.userInfo.id);
  const messages = useSelector(state => state.selectedUser.messages);

  const currentColors = {
    background: colors.background[theme],
    text: colors.text[theme],
    chat: colors.chat[theme]
  };

  // ─── Scroll to bottom whenever messages change ────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleScroll = () => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => { }, 1000);
  };

  // ─── Date grouping ────────────────────────────────────────────────────────
  const formatMessageDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const messageDate = new Date(timestamp);
    if (isNaN(messageDate.getTime())) return 'Unknown';   // guard

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) return 'Today';
    if (messageDate.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return messageDate.toLocaleDateString();
  };

  const groupMessagesByDate = (msgs) =>
    msgs.reduce((grouped, message) => {
      // FIX: use message.timestamp — matches your message object shape
      const date = formatMessageDate(message.timestamp);
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(message);
      return grouped;
    }, {});

  const groupedMessages = groupMessagesByDate(messages);

  // ─── Sender logic ─────────────────────────────────────────────────────────
  // message.sender is a plain string ID (not a nested object)
  // selectedUserId is the person I'm chatting WITH
  // if message.sender === selectedUserId  → they sent it  → received by me
  // if message.sender !== selectedUserId  → I sent it
  const isSentByMe = (message) => message.sender !== selectedUserId;

  // ─── Empty states ─────────────────────────────────────────────────────────
  if (!selectedUserId) {
    return (
      <div
        className="flex items-center justify-center h-[calc(100vh-180px)]"
        style={{ backgroundColor: currentColors.background.secondary }}
      >
        <p className="text-sm" style={{ color: currentColors.text.secondary }}>
          Select a conversation to start chatting
        </p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-[calc(100vh-180px)]"
        style={{ backgroundColor: currentColors.background.secondary }}
      >
        <p className="text-sm" style={{ color: currentColors.text.secondary }}>
          No messages yet. Say hello! 👋
        </p>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  // flex-col puts oldest group at top, newest at bottom
  // messagesEndRef at the very bottom keeps scroll anchored to latest message

  return (
    <div
      className="overflow-y-auto p-4 h-[calc(100vh-180px)] flex flex-col justify-end"
      style={{
        backgroundColor: currentColors.background.secondary,
        backgroundImage: theme === 'light'
          ? 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23f0f0f0\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          : 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23333333\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
      }}
      onScroll={handleScroll}
    >
      {/* Inner wrapper — grows naturally, pushes content to bottom */}
      <div className="flex flex-col">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="mb-4">

            {/* Date separator */}
            <div className="flex justify-center mb-3">
              <div
                className="px-3 py-1 rounded-full text-xs font-medium"
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
                key={message.messageId || index}
                message={message}
                isSentByMe={isSentByMe(message)}
                theme={theme}
                colors={colors}
              />
            ))}

          </div>
        ))}

        {/* Anchor — scroll always lands here (bottom of list) */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default memo(MessageList);