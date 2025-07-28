import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const ErrorModal = ({ 
  open, 
  onClose, 
  title = "Error", 
  message, 
  showIcon = true,
  confirmText = "OK",
  showCloseButton = true,
  isDarkMode = false
}) => {
  // Prevent scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      // Prevent backdrop close for error modals - user must click OK
      return;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Modal */}
        <div 
          className={`
            w-full max-w-md mx-auto rounded-xl shadow-2xl transform transition-all duration-300 ease-out
            max-h-[90vh] flex flex-col overflow-hidden
            sm:max-w-lg animate-pulse
            ${isDarkMode 
              ? 'bg-[#2d2d2d] border border-gray-600 text-white shadow-black/50' 
              : 'bg-white border border-gray-200 text-gray-800 shadow-gray-900/20'
            }
          `}
          style={{
            animation: 'modalSlideIn 0.3s ease-out forwards',
            boxShadow: isDarkMode 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              : '0 25px 50px -12px rgba(0, 84, 152, 0.25), 0 0 0 1px rgba(0, 84, 152, 0.05)'
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`
            px-6 py-4 flex items-center justify-between border-b
            ${isDarkMode 
              ? 'bg-[#383838] border-gray-600' 
              : 'bg-gray-50 border-gray-200'
            }
          `}>
            <div className="flex items-center gap-3">
              {showIcon && (
                <div className={`
                  p-2 rounded-full
                  ${isDarkMode ? 'bg-red-500/20' : 'bg-red-50'}
                `}>
                  <AlertCircle 
                    size={24} 
                    className="text-red-500 animate-pulse" 
                  />
                </div>
              )}
              <h2 
                id="modal-title"
                className="text-xl font-semibold"
              >
                {title}
              </h2>
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className={`
                  p-2 rounded-lg transition-all duration-200 group
                  focus:outline-none focus:ring-2 focus:ring-[#005498] focus:ring-offset-2
                  ${isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-white/10 focus:ring-offset-gray-800' 
                    : 'text-gray-600 hover:text-[#005498] hover:bg-[#005498]/10 focus:ring-offset-white'
                  }
                `}
                aria-label="Close modal"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className={`
            px-6 py-6 flex-1 overflow-y-auto
            ${isDarkMode ? 'bg-[#2d2d2d]' : 'bg-white'}
          `}>
            <div className="flex items-start gap-4">
              {showIcon && (
                <div className={`
                  w-1 h-16 rounded-full flex-shrink-0
                  ${isDarkMode ? 'bg-red-400' : 'bg-red-500'}
                `} />
              )}
              <div className="flex-1">
                <p 
                  id="modal-description"
                  className={`
                    text-base leading-relaxed whitespace-pre-wrap break-words
                    ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}
                  `}
                >
                  {message || 'An unexpected error occurred. Please try again.'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`
            px-6 py-4 flex justify-end border-t
            ${isDarkMode 
              ? 'bg-[#383838] border-gray-600' 
              : 'bg-gray-50 border-gray-200'
            }
          `}>
            <button
              onClick={onClose}
              className={`
                bg-[#005498] hover:bg-[#003A6B] text-white
                px-6 py-2.5 rounded-lg font-medium transition-all duration-200 
                transform hover:scale-105 active:scale-95
                shadow-lg hover:shadow-xl
                focus:outline-none focus:ring-2 focus:ring-[#005498] focus:ring-offset-2
                min-w-[100px] relative overflow-hidden group
                ${isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
              `}
            >
              <span className="relative z-10">{confirmText}</span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
};

export default ErrorModal;