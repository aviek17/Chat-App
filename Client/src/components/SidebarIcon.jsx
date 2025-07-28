
const SidebarIcon = ({ iconList = [] }) => {
    return (
        <>
            {
                iconList?.map((iconItems, index) => {
                    const IconComponent = iconItems.icon;
                    return (
                        <div
                            key={index}
                            className="cursor-pointer hover:bg-[#e6f4ff] p-[8px] rounded-sm w-fit"
                            onClick={iconItems.onClick}
                        >
                            <IconComponent className="text-[#005498] w-[20px] h-[20px]" />
                        </div>
                    );
                })
            }
        </>
    )
}

export default SidebarIcon
