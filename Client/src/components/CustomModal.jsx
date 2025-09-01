import React from 'react'

const CustomModal = ({ isOpen, onClose, children }) => {

    if (!isOpen) return null;

    return (
        <>
            <div
                className="absolute top-0 left-0 h-screen w-screen bg-black/30 backdrop-blur-sm z-50"
                onClick={() => onClose()}
            ></div>
            <div className="relative z-100">{children}</div>
        </>
    )
}

export default React.memo(CustomModal);
