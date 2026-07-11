import { useState } from 'react';
import { ResumeUploader } from './components/ResumeUploader';
import { FormSection } from './components/FormSection';
import { ResultsViewer } from './components/ResultsViewer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { orchestrateWorkflow } from './api';
import { OrchestratorResponse } from './types';
import { Briefcase, Heart } from 'lucide-react';

type AppState = 'input' | 'loading' | 'results' | 'error';

function App() {
  const [appState, setAppState] = useState<AppState>('input');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [results, setResults] = useState<OrchestratorResponse | null>(null);
  const [error, setError] = useState<string>('');
  const isLoading = appState === 'loading';

  const handleFileSelected = (file: File) => {
    setResumeFile(file);
  };

  const handleFormSubmit = async (jobRole: string, questions: string[]) => {
    if (!resumeFile) {
      setError('Please upload a resume first');
      setAppState('error');
      return;
    }

    setAppState('loading');
    setError('');

    try {
      const response = await orchestrateWorkflow({
        pdfFile: resumeFile,
        job_role: jobRole,
        policy_questions: questions,
      });

      setResults(response);
      setAppState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setAppState('error');
    }
  };

  const handleNewAnalysis = () => {
    setResumeFile(null);
    setResults(null);
    setError('');
    setAppState('input');
  };

  const handleRetry = () => {
    setError('');
    setAppState('input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg card-shadow p-8 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold gradient-text">Orion HR Assistant</h1>
          </div>
          <p className="text-center text-gray-600 text-lg">
            Instantly analyze resumes, generate personalized training plans, and answer policy questions
          </p>
          <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-3">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>using AI</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg card-shadow p-8">
          {appState === 'input' && (
            <div className="space-y-6">
              <ResumeUploader
                onFileSelected={handleFileSelected}
                disabled={isLoading}
              />

              {resumeFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-blue-900">{resumeFile.name}</p>
                    <p className="text-blue-700 text-sm">
                      {(resumeFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              )}

              {resumeFile && (
                <FormSection onSubmit={handleFormSubmit} loading={isLoading} />
              )}

              {!resumeFile && (
                <p className="text-center text-gray-500">Upload a resume to get started</p>
              )}
            </div>
          )}

          {appState === 'loading' && <LoadingSpinner />}

          {appState === 'results' && results && (
            <ResultsViewer data={results} onNewAnalysis={handleNewAnalysis} />
          )}

          {appState === 'error' && (
            <ErrorMessage message={error} onRetry={handleRetry} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white text-sm">
          <p>© 2024 Orion HR Assistant • Powered by Advanced AI</p>
        </div>
      </div>
    </div>
  );
}

export default App;
