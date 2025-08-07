import { ScoreGauge } from "./score-gauge";
import { SummaryCategory } from "./summary-category";

type Props = {
  feedback: Feedback;
};

export const Summary = ({ feedback }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGauge score={feedback.overallScore} />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the variables listed below
          </p>
        </div>
      </div>

      <div></div>
      <SummaryCategory
        title="Tone & Style"
        score={feedback.toneAndStyle.score}
      />
      <SummaryCategory title="Content" score={feedback.content.score} />
      <SummaryCategory title="Structure" score={feedback.structure.score} />
      <SummaryCategory title="Skills" score={feedback.skills.score} />
    </div>
  );
};
