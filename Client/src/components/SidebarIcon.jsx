const SidebarIcon = ({ iconList = [] }) => {
    return (
        <>
            {iconList?.map((iconItems, index) => {
                const IconComponent = iconItems.icon;
                return (
                    <div
                        key={index}
                        className={`relative cursor-pointer p-[8px] rounded-sm w-fit transition-all duration-300
                            hover:bg-[#e6f4ff]
                            ${iconItems.showBadge && iconItems.isNew
                                ? "animate-pulse shadow-[0_0_10px_4px_rgba(0,84,152,0.4)] rounded-md"
                                : ""
                            }`}
                        onClick={() => {
                            iconItems.onGlowDismiss?.();
                            iconItems.onClick?.();
                        }}
                    >
                        <IconComponent className="text-[#005498] w-[20px] h-[20px]" />

                        {/* Solid dot badge */}
                        {iconItems.showBadge && (
                            <span className="absolute top-1 right-1 w-[8px] h-[8px] bg-red-500 rounded-full" />
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default SidebarIcon;