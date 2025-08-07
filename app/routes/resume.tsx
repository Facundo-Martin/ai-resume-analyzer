import { Link, useNavigate, useParams } from "react-router";
import type { Route } from "./+types/resume";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind | Review" },
    { name: "description", content: "Detailed overview of your resume" },
  ];
}

export default function Resume() {
  const { id: uuid } = useParams();
  const navigate = useNavigate();
  const { auth, isLoading, fs, kv } = usePuterStore();

  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${uuid}`);

      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;

      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);

      console.log({ resumeUrl, imageUrl, feedback: data.feedback });
    };

    loadResume();
  }, [uuid]);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${uuid}`);
    }
  }, [isLoading]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="Resumind logo" className="size-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-2xl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold">Resume review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              Summary ATS details
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" />
          )}
        </section>
      </div>
      <div>resume {uuid}</div>
    </main>
  );
}
