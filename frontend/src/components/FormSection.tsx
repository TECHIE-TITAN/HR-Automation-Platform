import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface FormSectionProps {
  onSubmit: (jobRole: string, questions: string[]) => void;
  loading?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({ onSubmit, loading = false }) => {
  const [jobRole, setJobRole] = useState('');
  const [questions, setQuestions] = useState<string[]>(['']);

  const handleAddQuestion = () => {
    setQuestions([...questions, '']);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredQuestions = questions.filter(q => q.trim() !== '');
    if (!jobRole.trim()) {
      alert('Please enter a job role');
      return;
    }
    onSubmit(jobRole, filteredQuestions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Role */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Desired Job Role
        </label>
        <input
          type="text"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          placeholder="e.g., Senior Software Engineer, Product Manager"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          disabled={loading}
        />
      </div>

      {/* Policy Questions */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Policy Questions (Optional)
        </label>
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder={`Question ${index + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={loading}
              />
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddQuestion}
          className="mt-3 flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {loading ? 'Processing...' : 'Analyze Resume & Generate Plan'}
      </button>
    </form>
  );
};
