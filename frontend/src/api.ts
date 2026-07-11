import axios from 'axios';
import { OrchestratorRequest, OrchestratorResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const orchestrateWorkflow = async (data: OrchestratorRequest): Promise<OrchestratorResponse> => {
  try {
    const formData = new FormData();
    formData.append('pdf_file', data.pdfFile);
    formData.append('job_role', data.job_role);
    formData.append('policy_questions', JSON.stringify(data.policy_questions));

    const response = await api.post<OrchestratorResponse>('/orchestrate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message || 'An error occurred');
    }
    throw error;
  }
};

export default api;
