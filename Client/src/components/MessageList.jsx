import React, { memo, useCallback, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useSelector } from 'react-redux';

const MessageList = ({ selectedUserId, theme, colors, profilePic }) => {
  const messagesEndRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const messages = useSelector(state => state?.allUsersMsgs?.[selectedUserId]?.messages ?? []);
  
  const currentColors = {
    background: colors.background[theme],
    text: colors.text[theme],
    chat: colors.chat[theme]
  };

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

  const isSentByMe = (message) => message.sender !== selectedUserId;

  // ─── Format date label ────────────────────────────────────────────────────
  const formatMessageDate = (timestamp) => {
    if (!timestamp) return null;
    const messageDate = new Date(timestamp);
    if (isNaN(messageDate.getTime())) return null;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) return 'Today';
    if (messageDate.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return messageDate.toLocaleDateString();
  };

  const generateRandomHex = (length = 8) => {
    return [...crypto.getRandomValues(new Uint8Array(length))]
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  };

  // ─── Build flat render list ───────────────────────────────────────────────
  // Each item is either { type: 'date', label } or { type: 'message', data }
  // Single flat array — one scrollable div, no nested date wrappers
  const buildFlatList = (msgs) => {
    const flat = [];
    let lastDate = null;

    msgs.forEach((message) => {
      const dateLabel = formatMessageDate(message.timestamp);

      // Insert a date separator only when the date changes
      if (dateLabel && dateLabel !== lastDate) {
        flat.push({ type: 'date', label: dateLabel });
        lastDate = dateLabel;
      }

      flat.push({ type: 'message', data: message });
    });

    return flat;
  };

  const flatList = buildFlatList(messages);

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
        <p className="text-[16px] text-[#005498] font-[600]">
          No messages yet. Say hello! 👋
        </p>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="overflow-y-auto p-4 h-[calc(100vh-180px)]"
      style={{
        backgroundColor: currentColors.background.secondary,
        backgroundImage: theme === 'light'
          ? 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23f0f0f0\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          : 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23333333\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
      }}
      onScroll={handleScroll}
    >
      {/* Single flat div — one scroll container, date separators inline */}
      <div className="flex flex-col justify-end min-h-full">
        {flatList.map((item, index) => {

          if (item.type === 'date') {
            return (
              <div key={`date-${generateRandomHex()}`} className="flex justify-center my-3">
                <div
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: currentColors.background.elevated,
                    color: currentColors.text.secondary
                  }}
                >
                  {item.label}
                </div>
              </div>
            );
          }

          return (
            <MessageBubble
              key={item.data.messageId || index}
              message={item.data}
              isSentByMe={isSentByMe(item.data)}
              theme={theme}
              colors={colors}
              profilePic={profilePic}
            />
          );
        })}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default memo(MessageList);