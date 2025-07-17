

// import useAIStore from "../store/ai.store.js";

// import { useState } from "react";
// import {Star, RefreshCw, Brain } from "lucide-react";

// export const AI = () => {
//   const { score, feedback, userReview, isLoading, error, message} = useAIStore();
//   const [btnClick, setBtnClick] = useState(false);
//   const [showResults, setShowResults] = useState(false);

//   const handleClick = async () => {
//     console.log("Button clicked");
//     setBtnClick(true);
//     setShowResults(false);
//     await userReview();
//     setBtnClick(false);
//     setShowResults(true);
//     console.log(feedback);
//     console.log(score);
//   };

//   const getScoreColor = (score) => {
//     if (score >= 9) return "text-emerald-600";
//     if (score >= 8) return "text-blue-600";
//     if (score >= 7) return "text-amber-600";
//     return "text-red-500";
//   };

//   const getScoreGradient = (score) => {
//     if (score >= 9) return "from-emerald-500 to-teal-500";
//     if (score >= 8) return "from-blue-500 to-indigo-500";
//     if (score >= 7) return "from-amber-500 to-orange-500";
//     return "from-red-500 to-rose-500";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header Section */}
//         <div className="text-center mb-6">
//           <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl shadow-lg mb-3">
//             <Brain className="w-6 h-6 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-slate-800 mb-1">
//             AI Review
//           </h1>
//           <p className="text-slate-600 text-base">
//             Generate intelligent feedback and insights
//           </p>
//         </div>

//         {/* Main Card */}
//         <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//           {/* Generate Button Section - Only show when not loading and no results */}
//           {!isLoading && !showResults && (
//             <div className="p-6 border-b border-slate-100 transition-all duration-500">
//               <button
//                 className="w-full py-3 px-6 rounded-xl font-semibold text-base transition-all duration-300 transform bg-slate-800 hover:bg-slate-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
//                 onClick={handleClick}
//               >
//                 Generate AI Review
//               </button>
//             </div>
//           )}

//           {/* Content Section */}
//           <div className="p-6">
//             {/* Loading State */}
//             {isLoading && (
//               <div className="text-center py-8">
//                 <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4">
//                   <RefreshCw className="w-6 h-6 text-slate-600 animate-spin" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-slate-800 mb-2">Processing your review...</h3>
//                 <p className="text-slate-500 text-sm">Our AI is analyzing your performance</p>
//                 <div className="mt-4 w-full max-w-sm mx-auto bg-slate-200 rounded-full h-2">
//                   <div className="bg-gradient-to-r from-slate-600 to-slate-700 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
//                 </div>
//               </div>
//             )}

//             {/* Results */}
//             {!isLoading && showResults && (
//               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//                 {/* Score Section */}
//                 <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center space-x-3">
//                       <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
//                         <Star className="w-5 h-5 text-slate-600" />
//                       </div>
//                       <div>
//                         <h3 className="text-lg font-semibold text-slate-800">Performance Score</h3>
//                         <p className="text-slate-500 text-xs">Overall rating based on analysis</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
//                         {score}
//                       </div>
//                       <div className="text-slate-400 text-xs">/10</div>
//                     </div>
//                   </div>

//                   {/* Progress Bar */}
//                   <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
//                     <div
//                       className={`bg-gradient-to-r ${getScoreGradient(score)} h-2 rounded-full transition-all duration-1000 ease-out relative`}
//                       style={{ width: `${(score / 10) * 100}%` }}
//                     >
//                       <div className="absolute right-0 top-0 w-2 h-2 bg-white rounded-full border-2 border-current transform translate-x-1/2 -translate-y-0"></div>
//                     </div>
//                   </div>
//                   <div className="flex justify-between text-xs text-slate-500">
//                     <span>Poor</span>
//                     <span>Average</span>
//                     <span>Excellent</span>
//                   </div>
//                 </div>

//                 {/* Feedback Section */}
//                 <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
//                   <div className="flex items-center space-x-3 mb-4">
//                     <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
//                       <Brain className="w-5 h-5 text-slate-600" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-slate-800">AI Feedback</h3>
//                       <p className="text-slate-500 text-xs">Detailed analysis and recommendations</p>
//                     </div>
//                   </div>
//                   <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
//                     <p className="text-slate-700 leading-relaxed text-base">
//                       { !error? feedback: message }
//                     </p>
//                   </div>
//                 </div>

//                 {/* Reset Button */}
//                 <div className="text-center pt-2">
//                   <button
//                     className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 text-sm"
//                     onClick={() => {
//                       setShowResults(false);
//                       setBtnClick(false);
//                     }}
//                   >
//                     Generate New Review
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Empty State */}
//             {!isLoading && !showResults && (
//               <div className="text-center py-8">
//                 <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4">
//                   <Brain className="w-6 h-6 text-slate-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-slate-800 mb-2">Ready to Get Started?</h3>
//                 <p className="text-slate-500 max-w-md mx-auto text-sm">
//                   Click the button above to generate your personalized AI review and receive detailed feedback about your performance.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import useAIStore from "../store/ai.store.js";
import useStore from '../store/todoStore';
import { useState, useEffect } from "react";
import { Star, RefreshCw, Brain, Calendar } from "lucide-react";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export const AI = () => {
  const { date, setDate, userReview ,error,isLoading,score,feedback} = useStore();
  const [btnClick, setBtnClick] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Helper function to check if a date is today
  const isToday = (date) => {
    if (!date) return true; // null date means today
    const today = new Date();
    const compareDate = new Date(date);
    return compareDate.toDateString() === today.toDateString();
  };

  // Helper function to format date for display
  const formatDisplayDate = (date) => {
    if (!date || isToday(date)) {
      return 'Today';
    }
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Initialize date properly on component mount
  useEffect(() => {
    // If date is not null but is today's date, set it to null
    if (date && isToday(date)) {
      setDate(null);
    }
  }, []);

  // Handle date selection from calendar
  const handleDateSelect = (selectedDate) => {
    if (!selectedDate) return;

    // If selected date is today, set to null; otherwise set to the selected date
    if (selectedDate.toDateString() === new Date().toDateString()) {
      setDate(null);
    } else {
      setDate(selectedDate);
    }
    setShowCalendar(false);
  };

  const handleClick = async () => {
    console.log("Button clicked");
    setBtnClick(true);
    setShowResults(false);
    await userReview();
    setBtnClick(false);
    setShowResults(true);
    console.log(feedback);
    console.log(score);
    console.log(error);
  };

  const getScoreColor = (score) => {
    if (score >= 9) return "text-emerald-600";
    if (score >= 8) return "text-blue-600";
    if (score >= 7) return "text-amber-600";
    return "text-red-500";
  };

  const getScoreGradient = (score) => {
    if (score >= 9) return "from-emerald-500 to-teal-500";
    if (score >= 8) return "from-blue-500 to-indigo-500";
    if (score >= 7) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                {formatDisplayDate(date)}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Calendar className="w-6 h-6" />
                </button>

                {showCalendar && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border z-50">
                    <DayPicker
                      mode="single"
                      selected={date ? new Date(date) : new Date()}
                      onSelect={handleDateSelect}
                      className="p-3"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl shadow-lg mb-3">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            AI Review
          </h1>
          <p className="text-slate-600 text-base">
            Generate intelligent feedback and insights for {formatDisplayDate(date)}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Generate Button Section - Only show when not loading and no results */}
          {!isLoading && !showResults && (
            <div className="p-6 border-b border-slate-100 transition-all duration-500">
              <button
                className="w-full py-3 px-6 rounded-xl font-semibold text-base transition-all duration-300 transform bg-slate-800 hover:bg-slate-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                onClick={handleClick}
              >
                Generate AI Review
              </button>
            </div>
          )}

          {/* Content Section */}
          <div className="p-6">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4">
                  <RefreshCw className="w-6 h-6 text-slate-600 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Processing your review...</h3>
                <p className="text-slate-500 text-sm">Our AI is analyzing your performance</p>
                <div className="mt-4 w-full max-w-sm mx-auto bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-slate-600 to-slate-700 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}

            {/* Results */}
            {!isLoading && showResults && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Score Section */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                        <Star className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">Performance Score</h3>
                        <p className="text-slate-500 text-xs">Overall rating based on analysis</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                        {score}
                      </div>
                      <div className="text-slate-400 text-xs">/10</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div
                      className={`bg-gradient-to-r ${getScoreGradient(score)} h-2 rounded-full transition-all duration-1000 ease-out relative`}
                      style={{ width: `${(score / 10) * 100}%` }}
                    >
                      <div className="absolute right-0 top-0 w-2 h-2 bg-white rounded-full border-2 border-current transform translate-x-1/2 -translate-y-0"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Poor</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                      <Brain className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">AI Feedback</h3>
                      <p className="text-slate-500 text-xs">Detailed analysis and recommendations</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                    <p className="text-slate-700 leading-relaxed text-base">
                      {!isLoading && (feedback !== null ? feedback : error)}
                      
                    </p>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="text-center pt-2">
                  <button
                    className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 text-sm"
                    onClick={() => {
                      setShowResults(false);
                      setBtnClick(false);
                    }}
                  >
                    Generate New Review
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !showResults && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4">
                  <Brain className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Ready to Get Started?</h3>
                <p className="text-slate-500 max-w-md mx-auto text-sm">
                  Click the button above to generate your personalized AI review and receive detailed feedback about your performance for {formatDisplayDate(date)}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};