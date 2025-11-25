import ActionImage from "./ActionImage";
import ActionInfo from "./ActionInfo";

export default function ActionContent({ action, actionData, progressData, userId }) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <ActionImage action={action} />
                <ActionInfo 
                    action={action}
                    actionData={actionData}
                    progressData={progressData}
                    userId={userId}
                />
            </div>
        </div>
    );
}