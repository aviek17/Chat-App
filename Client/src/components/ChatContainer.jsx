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
                    <div className="w-64 h-64 mx-auto mb-6 opacity-40">
                        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                            <rect width="256" height="256" fill="transparent" />
                            <circle cx="128" cy="112" r="72" fill="#005498" />
                            <path d="M 80 152 L 56 192 L 96 168 Z" fill="#005498" />
                            <line x1="88" y1="88" x2="152" y2="88" stroke="white" stroke-width="6" stroke-linecap="round" />
                            <line x1="88" y1="112" x2="168" y2="112" stroke="white" stroke-width="6" stroke-linecap="round" />
                            <line x1="88" y1="136" x2="136" y2="136" stroke="white" stroke-width="6" stroke-linecap="round" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2" style={{ color: currentColors.text.secondary }}>
                        Talk Sphere
                    </h2>
                    <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: currentColors.text.disabled }}>
                        Select a chat to start messaging, or create a new conversation to connect with your contacts.
                    </p>
                </div>
            </div >
        );
    }


    return (
        <div className="bg-white flex-1">
            chat
        </div>
    )
}

export default ChatContainer
