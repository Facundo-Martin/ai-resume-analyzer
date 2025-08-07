import { Link, useNavigate } from "react-router";
import { ScoreCircle } from "./score-circle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

export const ResumeCard = ({
  id,
  companyName,
  jobTitle,
  feedback,
  imagePath,
}: Resume) => {
  const { isLoading, auth, fs } = usePuterStore();
  const navigate = useNavigate();

  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResumes = async () => {
      const blob = await fs.read(imagePath);

      if (!blob) return;

      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };
    loadResumes();
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      {/* Resume header */}
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="!text-black font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="!text-black font-bold">Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {/* Resume preview */}
      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt={`${jobTitle} at ${companyName} resume`}
              className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};
