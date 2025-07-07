import  useAIStore  from "../store/ai.store.js";
import { useState } from "react";
import { Sparkles, Star, RefreshCw } from "lucide-react";

export const AI = () => {
  const { score, feedback, userReview, isLoading, test } = useAIStore();
  const [btnClick, setBtnClick] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleClick = async () => {
    console.log("Button clicked");
    setBtnClick(true);
    setShowResults(false);
    await userReview();
    setBtnClick(false);
    setShowResults(true);
    console.log(feedback);
    console.log(score);
  };

  const getScoreColor = (score) => {
    if (score >= 9) return "text-emerald-600";
    if (score >= 8) return "text-blue-600";
    if (score >= 7) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl" style={{ maxWidth: '900px' }}>
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
              <Sparkles className="w-6 h-6 text-gray-600" />
            </div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              AI Review
            </h1>
            <p className="text-gray-500 text-sm">
              Generate intelligent feedback and insights
            </p>
          </div>

          {/* Generate Button */}
          <div className="mb-8">
            <button
              className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                btnClick || isLoading
                  ? "bg-gray-900 text-white cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md"
              }`}
              onClick={handleClick}
              disabled={btnClick || isLoading}
            >
              {btnClick || isLoading ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                "Generate AI Review"
              )}
            </button>
          </div>

          {/* Results */}
          {!isLoading && showResults && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Score */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 font-medium">Score</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className={`text-2xl font-semibold ${getScoreColor(score)}`}>
                      {score}
                    </span>
                    <span className="text-gray-400 ml-1">/10</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-gray-600 font-medium mb-3">Feedback</h3>
                <p className="text-gray-700 leading-relaxed">
                  {feedback}
                </p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full animate-pulse mb-4">
                <RefreshCw className="w-4 h-4 text-gray-600 animate-spin" />
              </div>
              <p className="text-gray-500 text-sm">Processing your review...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
