import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
    X,
    MessageCircle,
    Phone,
    Video,
    Search,
    Info,
    Mail,
    Fingerprint,
    BellOff,
    Ban,
    Trash2,
    MoreHorizontal,
} from 'lucide-react';

const ContactProfileModal = ({ isOpen, onClose, onMessage, contact, profilePic, isOnline }) => {
    const overlayRef = useRef(null);
    const modalRef = useRef(null);


    const initials = (contact.displayName || 'U')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();


    useEffect(() => {
        const overlay = overlayRef.current;
        const modal = modalRef.current;
        if (!overlay || !modal) return;

        if (isOpen) {
            overlay.style.pointerEvents = 'all';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    overlay.style.backgroundColor = 'rgba(0,0,0,0.45)';
                    modal.style.transform = 'scaleY(1) scaleX(1)';
                    modal.style.opacity = '1';
                });
            });
        } else {
            overlay.style.backgroundColor = 'rgba(0,0,0,0)';
            modal.style.transform = 'scaleY(0.05) scaleX(0.92)';
            modal.style.opacity = '0';
            const timer = setTimeout(() => {
                overlay.style.pointerEvents = 'none';
            }, 380);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);


    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);


    const ActionButton = ({ icon: Icon, label, onClick }) => (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0"
        >
            <div className="w-11 h-11 rounded-full bg-[#005498]/10 flex items-center justify-center
                            transition-all duration-150 hover:bg-[#005498]/20 hover:scale-105 active:scale-95">
                <Icon size={18} className="text-[#005498]" />
            </div>
            <span className="text-[11px] font-medium text-gray-500">{label}</span>
        </button>
    );

    const InfoRow = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-3 px-5 py-3 relative
                        after:content-[''] after:absolute after:bottom-0 after:left-[52px] after:right-0 after:h-px after:bg-gray-100 last:after:hidden">
            <Icon size={18} className="text-[#005498] flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#005498] mb-0.5">
                    {label}
                </p>
                <p className="text-[13px] text-gray-700 leading-snug break-words">{value || '—'}</p>
            </div>
        </div>
    );

    const FooterBtn = ({ icon: Icon, label, danger = false, onClick }) => (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium
                        bg-transparent border-0 cursor-pointer text-left transition-colors duration-150
                        ${danger
                    ? 'text-red-600 hover:bg-red-50 active:bg-red-100'
                    : 'text-[#005498] hover:bg-[#005498]/07 active:bg-[#005498]/12'
                }`}
        >
            <Icon size={16} />
            {label}
        </button>
    );

    return (
        
        <div
            ref={overlayRef}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                backgroundColor: 'rgba(0,0,0,0)',
                pointerEvents: 'none',
                transition: 'background-color 0.35s ease',
            }}
            aria-modal="true"
            role="dialog"
            aria-label="Contact info"
        >
            
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className="w-[360px] max-h-[90vh] rounded-2xl bg-white overflow-hidden flex flex-col
                           border border-gray-100"
                style={{
                    transform: 'scaleY(0.05) scaleX(0.92)',
                    opacity: 0,
                    transformOrigin: 'center center',
                    transition:
                        'transform 0.42s cubic-bezier(0.34,1.46,0.64,1), opacity 0.22s ease',
                    boxShadow: '0 20px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,84,152,0.12)',
                }}
            >
                
                <div className="flex items-center justify-between px-4 py-3.5 bg-[#4391d1]/10 flex-shrink-0">
                    <span className="text-[14px] font-medium text-[#005498]">Contact info</span>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center
                                   bg-transparent border-0 cursor-pointer
                                   hover:bg-[#005498]/10 active:bg-[#005498]/20 transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                
                <div className="flex flex-col items-center pt-7 pb-5 px-4 bg-white flex-shrink-0">
                    <div className="relative mb-3">
                        
                        <div
                            className="w-[86px] h-[86px] rounded-full p-[3px]"
                            style={{ border: `3px solid ${isOnline ? '#4CAF50' : '#ccc'}` }}
                        >
                            <div className="w-full h-full rounded-full bg-[#005498] flex items-center justify-center overflow-hidden">
                                {profilePic ? (
                                    <img
                                        src={profilePic}
                                        alt={contact.displayName || 'User'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl font-semibold text-white">{initials}</span>
                                )}
                            </div>
                        </div>
                        
                        <span
                            className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-[2.5px] border-white"
                            style={{ backgroundColor: isOnline ? '#4CAF50' : '#ccc' }}
                        />
                    </div>

                    <h2 className="text-[17px] font-semibold text-gray-800 mb-0.5">
                        {contact.displayName || 'Unknown'}
                    </h2>
                    <p className="text-[12px] text-gray-400 mb-2">
                        @{contact.username || contact.userName || 'username'}
                    </p>

                    
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium"
                        style={{
                            background: isOnline ? 'rgba(76,175,80,0.12)' : 'rgba(0,0,0,0.06)',
                            color: isOnline ? '#2e7d32' : '#888',
                        }}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: isOnline ? '#4CAF50' : '#aaa' }}
                        />
                        {isOnline ? 'Online' : 'Offline'}
                    </span>
                </div>

                
                <div className="flex justify-center gap-7 px-4 pb-4 bg-white flex-shrink-0">
                    <ActionButton icon={MessageCircle} label="Message" onClick={onMessage} />
                    <ActionButton icon={Phone} label="Audio" />
                    <ActionButton icon={Video} label="Video" />
                    <ActionButton icon={Search} label="Search" />
                </div>

                <div className="h-px bg-gray-100 flex-shrink-0" />

                
                <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200">

                    <InfoRow icon={Info} label="Bio" value={contact.bio} />
                    <InfoRow icon={Mail} label="Email" value={contact.email} />
                    <InfoRow icon={Phone} label="Phone" value={contact.phoneNo} />
                    <InfoRow icon={Fingerprint} label="User ID" value={contact.uid || contact.id} />

                    <div className="h-px bg-gray-100 mx-0" />

                    
                    <div className="px-2 py-3 flex flex-col gap-0.5">
                        <FooterBtn icon={BellOff} label="Mute notifications" />
                        <FooterBtn icon={Ban} label={`Block ${contact.displayName || 'user'}`} danger />
                        <FooterBtn icon={Trash2} label="Delete chat" danger />
                    </div>
                </div>

                
                <div className="flex gap-2 px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
                    <button
                        onClick={onMessage}
                        className="flex-1 flex items-center justify-center gap-2
                                   bg-[#005498] hover:bg-[#003A6B] active:scale-[0.98]
                                   text-white text-[13px] font-medium
                                   rounded-full py-2.5 border-0 cursor-pointer
                                   transition-all duration-150"
                    >
                        <MessageCircle size={15} />
                        Send message
                    </button>
                    <button
                        className="flex items-center gap-1.5 px-4 py-2.5
                                   border border-gray-200 rounded-full
                                   text-[13px] font-medium text-gray-500
                                   bg-transparent hover:bg-gray-50 active:bg-gray-100
                                   cursor-pointer transition-colors duration-150"
                    >
                        <MoreHorizontal size={15} />
                        More
                    </button>
                </div>
            </div>
        </div>
    );
}


export default ContactProfileModal;