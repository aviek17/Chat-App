const SidebarIcon = ({ iconList = [] }) => {
    return (
        <>
            {iconList?.map((iconItems, index) => {
                const IconComponent = iconItems.icon;

                return (
                    <div
                        key={index}
                        className={`relative cursor-pointer p-[8px] rounded-sm w-fit transition-all duration-300 hover:bg-[#e6f4ff]`}
                        onClick={iconItems.onClick}
                    >
                        <IconComponent className="text-[#005498] w-[20px] h-[20px]" />

                        {iconItems.active && (
                            <span className="absolute top-1 right-1 w-[8px] h-[8px] bg-[#005498] rounded-full" />
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default SidebarIcon;