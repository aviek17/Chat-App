import { useSelector } from "react-redux";
import { colors } from "../styles/theme";

const ChatContainer = () => {

  const theme = useSelector((state) => state.theme.themeMode);
  const selectedChatId = null;

  const currentColors = {
    background: colors.background[theme],
    text: colors.text[theme],
    chat: colors.chat[theme]
  };

   if (!selectedChatId) {
    return (
      <div 
        className="flex-1 flex items-center justify-center"
        style={{ backgroundColor: currentColors.background.secondary }}
      >
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-6 opacity-20">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M60 80 Q100 60 140 80 Q120 100 100 120 Q80 100 60 80" fill="currentColor" opacity="0.3"/>
              <circle cx="80" cy="90" r="8" fill="currentColor"/>
              <circle cx="120" cy="90" r="8" fill="currentColor"/>
            </svg>
          </div>
          <h2 className="text-2xl font-light mb-2" style={{ color: currentColors.text.secondary }}>
            WhatsApp Web
          </h2>
          <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: currentColors.text.disabled }}>
            Select a chat to start messaging, or create a new conversation to connect with your contacts.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-white flex-1">
      chat
    </div>
  )
}

export default ChatContainer
