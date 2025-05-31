import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const DonutProgress = ({ value }) => {
    return (
        <div className="mt-2 lg:w-[130px] lg:h-[130px]" style={{ width: 130, height: 130 }}>
            <CircularProgressbar
                value={value}
                text={`${value}%`}
                strokeWidth={18}
                styles={buildStyles({
                    pathColor: "#005840",
                    trailColor: "#e5e7eb",
                    textColor: "#005840",
                    textSize: "16px",
                })}
            />
        </div>
    )
}