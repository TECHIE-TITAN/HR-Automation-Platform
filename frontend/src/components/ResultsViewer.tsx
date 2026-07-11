import React from 'react';
import { OrchestratorResponse } from '../types';
import { CheckCircle, Award, BookOpen, MessageSquare } from 'lucide-react';

interface ResultsViewerProps {
  data: OrchestratorResponse;
  onNewAnalysis: () => void;
}

export const ResultsViewer: React.FC<ResultsViewerProps> = ({ data, onNewAnalysis }) => {
  const { candidate_info, onboarding_plan, policy_answers } = data;

  const scorePercentage = (candidate_info.score / 100) * 100;

  const parseOnboardingPlan = (plan: string) => {
    const lines = plan.split('\n').filter(line => line.trim());
    return lines;
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Analysis Complete!</h2>
        <p className="text-blue-100">Here's the comprehensive analysis for {candidate_info.name}</p>
      </div>

      {/* Candidate Info Card */}
      <div className="bg-white rounded-lg card-shadow p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h3 className="text-2xl font-bold text-gray-800">Candidate Profile</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Name</p>
            <p className="text-lg font-semibold text-gray-800">{candidate_info.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">College</p>
            <p className="text-lg font-semibold text-gray-800">{candidate_info.College}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">CGPA</p>
            <p className="text-lg font-semibold text-gray-800">{candidate_info.CGPA}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Overall Score</p>
            <div className="flex items-center gap-3">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
              <span className="font-semibold text-lg text-gray-800">{candidate_info.score}/100</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Technical Skills</p>
            <div className="flex flex-wrap gap-2">
              {candidate_info.Tech_skills && candidate_info.Tech_skills.length > 0 ? (
                candidate_info.Tech_skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No technical skills found</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Soft Skills</p>
            <div className="flex flex-wrap gap-2">
              {candidate_info.Soft_skills && candidate_info.Soft_skills.length > 0 ? (
                candidate_info.Soft_skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No soft skills found</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Plan */}
      <div className="bg-white rounded-lg card-shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-amber-500" />
          <h3 className="text-2xl font-bold text-gray-800">Personalized Onboarding Plan</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          {parseOnboardingPlan(onboarding_plan).map((line, i) => (
            <p
              key={i}
              className={`text-gray-700 leading-relaxed ${
                line.startsWith('Day') || line.includes(':') ? 'font-semibold text-blue-900' : ''
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Policy Q&A */}
      {Object.keys(policy_answers).length > 0 && (
        <div className="bg-white rounded-lg card-shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-6 h-6 text-green-500" />
            <h3 className="text-2xl font-bold text-gray-800">Policy Questions & Answers</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(policy_answers).map(([question, answer], i) => (
              <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-semibold text-gray-800 text-lg mb-2">Q: {question}</p>
                <p className="text-gray-700 leading-relaxed">A: {answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={onNewAnalysis}
        className="w-full py-3 px-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all border-2 border-blue-600 shadow-lg"
      >
        Analyze Another Candidate
      </button>
    </div>
  );
};
