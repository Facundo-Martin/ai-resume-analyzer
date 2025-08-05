import { Link } from "react-router";
import { ScoreCircle } from "./score-circle";

export const ResumeCard = ({
  id,
  companyName,
  jobTitle,
  feedback,
  imagePath,
}: Resume) => {
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      {/* Resume header */}
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="!text-black font-bold break-words">{companyName}</h2>
          <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {/* Resume preview */}
      <div className="gradient-border animate-in fade-in duration-1000">
        <div className="w-full h-full">
          <img src={imagePath} alt={`${jobTitle} at ${companyName} resume`} />
        </div>
      </div>
    </Link>
  );
};
