import { useSelector } from "react-redux";
import { colors } from "../styles/theme";
import { useCallback, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";


const mockContact = {
    id: 1,
    name: 'Sarah Wilson',
    avatar: 'SW',
    status: 'online', // 'online', 'away', 'offline'
    lastSeen: 'last seen 2 hours ago'
};
const mockMessages = [
    {
        id: 1,
        type: 'text',
        content: 'Hey! How are you doing?',
        timestamp: '2024-01-20T10:30:00Z',
        sender: 'other',
        senderName: 'Sarah Wilson',
        senderAvatar: 'SW',
        status: 'read'
    },
    {
        id: 2,
        type: 'text',
        content: 'I\'m doing great! Just finished my morning workout. How about you?',
        timestamp: '2024-01-20T10:32:00Z',
        sender: 'user',
        status: 'read'
    },
    {
        id: 3,
        type: 'text',
        content: 'That\'s awesome! I should really get back into working out. Any tips for getting motivated?',
        timestamp: '2024-01-20T10:35:00Z',
        sender: 'other',
        senderName: 'Sarah Wilson',
        senderAvatar: 'SW',
        status: 'read'
    },
    {
        id: 4,
        type: 'text',
        content: 'Start small! Even 10 minutes a day makes a difference. The key is consistency over intensity.',
        timestamp: '2024-01-20T10:37:00Z',
        sender: 'user',
        status: 'read'
    },
    {
        id: 5,
        type: 'text',
        content: 'You\'re absolutely right. I think I\'ll start with some light yoga tomorrow morning.',
        timestamp: '2024-01-20T10:40:00Z',
        sender: 'other',
        senderName: 'Sarah Wilson',
        senderAvatar: 'SW',
        status: 'read'
    },
    {
        id: 6,
        type: 'text',
        content: 'That sounds perfect! Yoga is such a great way to start the day. Let me know how it goes!',
        timestamp: '2024-01-20T10:42:00Z',
        sender: 'user',
        status: 'delivered'
    },
    {
        id: 7,
        type: 'text',
        content: 'Will do! Thanks for the encouragement 😊',
        timestamp: '2024-01-20T14:15:00Z',
        sender: 'other',
        senderName: 'Sarah Wilson',
        senderAvatar: 'SW',
        status: 'read'
    },
    {
        id: 8,
        type: 'text',
        content: 'By the way, are we still on for lunch tomorrow?',
        timestamp: '2024-01-20T14:16:00Z',
        sender: 'other',
        senderName: 'Sarah Wilson',
        senderAvatar: 'SW',
        status: 'read'
    },
    {
        id: 9,
        type: 'text',
        content: 'Absolutely! 12:30 PM at that new Italian place, right?',
        timestamp: '2024-01-20T14:20:00Z',
        sender: 'user',
        status: 'sent'
    }
];

const ChatContainer = () => {

    const theme = useSelector((state) => state.theme.themeMode);
    const selectedChatId = "some id";
    const [messages, setMessages] = useState(mockMessages);
    const [contact] = useState(mockContact);

    const currentColors = {
        background: colors.background[theme],
        text: colors.text[theme],
        chat: colors.chat[theme]
    };

     const handleNewMessage = useCallback((newMessage) => {
        console.log('New message received in parent:', newMessage); 
        window.alert(`New message: ${newMessage.message}`);      
    }, []);

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
    

    const handleSendMessage = (newMessage) => {
        const message = {
            ...newMessage,
            id: Date.now(), 
        };
        setMessages(prev => [...prev, message]);
    };


    return (
        <div
            className="flex-1 flex flex-col h-[calc(100vh-50px)]"
            style={{ backgroundColor: currentColors.background.primary }}
        >
            <ChatHeader contact={contact} theme={theme} colors={colors} />
            <MessageList messages={messages} theme={theme} colors={colors} onNewMessage={handleNewMessage}/>
            <MessageInput onSendMessage={handleSendMessage} theme={theme} colors={colors} />
        </div>
    )
}

export default ChatContainer
