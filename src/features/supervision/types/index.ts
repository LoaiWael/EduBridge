/**
 * Status for supervision requests
 */
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

/**
 * Supervision request from student to TA/professor
 */
export interface SupervisionRequest {
  id: string;
  studentId: string;
  supervisorId?: string;
  projectId: string;
  status: RequestStatus;
  createdAt: Date;
  reviewedAt?: Date;
  notes?: string;
}