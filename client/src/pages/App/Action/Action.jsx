// ============================================
// 1. COMPONENTE PRINCIPAL - Action.jsx
// ============================================
import { useNavigate, useParams } from "react-router-dom";
import ACTIONS from "../../../assets/data/actions.json";

import ActionHeader from "./components/ActionHeader";
import ActionContent from "./components/ActionContent";
import { useAuth } from "../../../hooks/useAuth";
import { useActionData } from "../../../hooks/useActionData";
import { useActionProgress } from "../../../hooks/useActionProgress";

export function Action() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { userId } = useAuth();
    
    const action = ACTIONS.find(action => action._id === id);
    
    const actionData = useActionData(userId, id);
    const progressData = useActionProgress(userId, id);

    const goBack = () => navigate(-1);

    if (!action) {
        return <div>Acción no encontrada</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
            <ActionHeader 
                action={action}
                onBack={goBack}
            />
            <ActionContent 
                action={action}
                actionData={actionData}
                progressData={progressData}
                userId={userId}
            />
        </div>
    );
}