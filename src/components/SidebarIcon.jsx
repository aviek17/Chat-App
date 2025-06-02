
const SidebarIcon = ({ iconList = [], onIconClick }) => {
    return (
        <>
            {
                iconList?.map((IconComp, index) => (

                    <div key={index} className="cursor-pointer hover:bg-[#e6f4ff] p-[8px] rounded-sm w-fit" onClick={onIconClick}>
                        <IconComp className="text-[#005498]" />
                    </div>

                ))
            }
        </>
    )
}

export default SidebarIcon
