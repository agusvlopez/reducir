import ACTIONS from "../../assets/data/greenSteps.actions.json";


export function PostContent({
    image,
    content,
    category,
    actionId,
    carbon
}) {
    const action = ACTIONS?.find(a => a._id === actionId);
    
    return (
        <div className="flex flex-col gap-4">
            <div>
                {action && <p className="text-sm text-dark-green"><span className="font-semibold">Acción:</span> {action.title}</p>}
                {carbon && <p className="text-sm text-dark-green "><span className="font-semibold">Carbon reducido:</span> -{carbon} kg</p>}
                <p className="my-2">{content}</p>                
                <p className="text-sm mt-2 flex justify-end gap-1 text-dark-green"><span className="font-semibold">Categoría: </span> {category}</p>                
            </div>

            <img src={image} alt="" className="rounded-[30px]" />
        </div>
    )
}