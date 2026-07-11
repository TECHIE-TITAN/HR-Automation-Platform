export interface CandidateInfo {
  name: string;
  College: string;
  Tech_skills: string[];
  Soft_skills: string[];
  CGPA: string;
  score: number;
}

export interface OrchestratorResponse {
  candidate_info: CandidateInfo;
  onboarding_plan: string;
  policy_answers: Record<string, string>;
}

export interface OrchestratorRequest {
  pdfFile: File;
  job_role: string;
  policy_questions: string[];
}
