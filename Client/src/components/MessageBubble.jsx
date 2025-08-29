
import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, theme, colors, selectedUserId }) => {
  const currentColors = {
    background: colors.background[theme],
    text: colors.text[theme],
    chat: colors.chat[theme]
  };

  const isUserMessage = message?.sender?._id === selectedUserId;

  const bubbleStyle = {
    backgroundColor: isUserMessage ? currentColors.chat.userBubble : currentColors.chat.otherBubble,
    color: isUserMessage ? currentColors.chat.userBubbleText : currentColors.chat.otherBubbleText,
    maxWidth: '100%'
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check size={16} style={{ color: currentColors.text.secondary }} />;
      case 'delivered':
        return <CheckCheck size={16} style={{ color: currentColors.text.secondary }} />;
      case 'read':
        return <CheckCheck size={16} style={{ color: colors.primary.main }} />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex mb-3 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-end space-x-2 max-w-full">
        {!isUserMessage && (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium" style={{ color: currentColors.text.primary }}>
              {message.senderAvatar}
            </span>
          </div>
        )}

        <div className="flex flex-col">
          {!isUserMessage && message.senderName && (
            <span className="text-xs mb-1 ml-3" style={{ color: currentColors.text.secondary }}>
              {message?.sender?.userName}
            </span>
          )}

          <div
            className={`px-4 py-2 rounded-lg relative ${isUserMessage
                ? 'rounded-br-sm'
                : 'rounded-bl-sm'
              }`}
            style={bubbleStyle}
          >
            <p className="text-sm break-words whitespace-pre-wrap">
              {message.content}
            </p>
            {/* {message.type === 'text' && (
              
            )}
            
            {message.type === 'image' && (
              <div className="space-y-2">
                <img 
                  src={message.content} 
                  alt="Shared image" 
                  className="max-w-full h-auto rounded-lg"
                />
                {message.caption && (
                  <p className="text-sm break-words whitespace-pre-wrap">
                    {message.caption}
                  </p>
                )}
              </div>
            )}
            
            {message.type === 'file' && (
              <div className="flex items-center space-x-3 p-2 rounded-lg border" 
                   style={{ borderColor: theme === 'light' ? '#e0e0e0' : '#505050' }}>
                <div className="w-8 h-8 rounded bg-gray-300 flex items-center justify-center">
                  <span className="text-xs font-medium">📄</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{message.fileName}</p>
                  <p className="text-xs opacity-70">{message.fileSize}</p>
                </div>
              </div>
            )} */}

            <div className="flex items-center justify-end space-x-1 mt-1">
              <span className="text-xs opacity-70">
                {formatTime(message.createdAt)}
              </span>
              {isUserMessage && getStatusIcon(message.status)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;