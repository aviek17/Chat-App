import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { colors } from '../styles/theme';

const SuccessModal = ({ isOpen, onClose, isLogin, userEmail }) => {

  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");

  useEffect(() => {

    if (!isOpen) return;

    const loadInitialApis = async () => {

      try {

        // API 1
        setLoadingText("Loading profile...");
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(20);

        // API 2
        setLoadingText("Fetching contacts...");
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(40);

        // API 3
        setLoadingText("Loading chats...");
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(60);

        // API 4
        setLoadingText("Syncing groups...");
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(80);

        // API 5
        setLoadingText("Preparing workspace...");
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(100);

        setLoadingText("Done");

        setTimeout(() => {
          onClose?.();
        }, 500);

      } catch (error) {
        console.error(error);
      }
    };

    loadInitialApis();

  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0f2f5]">

      <div
        className="
            w-full
            max-w-[420px]
            px-8
            py-10
            rounded-3xl
            bg-white
            shadow-xl
            border
            border-[#e4e6ea]
        "
      >

        {/* Logo */}
        <div className="flex justify-center mb-6">

          <div
            className="
                      w-[72px]
                      h-[72px]
                      rounded-full
                      flex
                      items-center
                      justify-center
                    "
            style={{
              backgroundColor: colors.primary.main
            }}
          >
            <MessageCircle className="w-9 h-9 text-white" />
          </div>

        </div>

        {/* Heading */}
        <div className="text-center mb-8">

          <h2
            className="text-[22px] font-bold mb-2"
            style={{
              color: colors.text.light.primary
            }}
          >
            {isLogin ? 'Welcome Back!' : 'Account Created!'}
          </h2>

          <p
            className="text-[14px]"
            style={{
              color: colors.text.light.secondary
            }}
          >
            {isLogin
              ? <> Successfully signed in as ${userEmail}. <br /> Loading your chats...</>
              : `Your account has been created successfully. Welcome to the chat!`}
          </p>

        </div>

        {/* Progress Bar */}
        <div className="w-full">

          <div
            className="
                            w-full
                            h-[8px]
                            rounded-full
                            overflow-hidden
                            bg-[#e8edf2]
                        "
          >

            <div
              className="
                                h-full
                                rounded-full
                                transition-all
                                duration-500
                                ease-out
                            "
              style={{
                width: `${progress}%`,
                backgroundColor: colors.primary.main
              }}
            />

          </div>

          {/* Percentage */}
          <div className="flex justify-end mt-2">

            <span
              className="text-[13px] font-semibold"
              style={{
                color: colors.primary.main
              }}
            >
              {progress}%
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SuccessModal;
