import { Check, CheckCheck, CircleCheck } from 'lucide-react';
// isSentByMe is computed in MessageList:
//   message.sender !== selectedUserId  →  I sent it   → align right
//   message.sender === selectedUserId  →  they sent it → align left

const MessageBubble = ({ message, isSentByMe, theme, colors, profilePic }) => {
  const currentColors = {
    background: colors.background[theme],
    text: colors.text[theme],
    chat: colors.chat[theme]
  };

  // ─── Bubble styles ────────────────────────────────────────────────────────
  const bubbleStyle = {
    backgroundColor: isSentByMe
      ? currentColors.chat.userBubble
      : currentColors.chat.otherBubble,
    color: isSentByMe
      ? currentColors.chat.userBubbleText
      : currentColors.chat.otherBubbleText,
  };

  // ─── Status icon (only on my messages) ───────────────────────────────────
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check size={14} style={{ color: "#fff" }} />;
      case 'delivered':
        return <CircleCheck size={14} style={{ color: "#fff" }} />;
      case 'read':
        return <CheckCheck size={14} style={{ color: "#fff"}} />;
      default:
        return null;
    }
  };

  // ─── Time format — FIX: use message.timestamp not message.createdAt ───────
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex mb-3 px-2 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end gap-2 max-w-[60%] min-w-0 ${isSentByMe ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* {!isSentByMe && (
          <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 self-end">
            <span className="text-xs font-medium" style={{ color: currentColors.text.primary }}>
              {message.senderAvatar ?? '?'}
            </span>
          </div>
        )} */}

        {!isSentByMe && (
          <div className="w-7 h-7 rounded-full bg-[#005498] flex items-center justify-center overflow-hidden flex-shrink-0 self-end">
            {profilePic ? (
              <img
                src={profilePic}
                alt={"User"}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span
                className="text-xs font-medium text-white"
              >
                {"U"}
              </span>
            )}
          </div>
        )}

        {/* Bubble */}
        <div
          className={`px-4 py-2 rounded-2xl w-fit min-w-[60px] ${isSentByMe ? 'rounded-br-sm' : 'rounded-bl-sm'
            }`}
          style={bubbleStyle}
        >

          <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">
            {message.messageContent}
          </p>

          <div className={`flex items-center gap-1 mt-1 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs opacity-60">
              {formatTime(message.timestamp)}
            </span>
            {isSentByMe && getStatusIcon(message.status)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;