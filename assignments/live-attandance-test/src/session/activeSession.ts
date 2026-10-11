export interface ActiveSession {
  classId: string;
  startedAt: string;
  attendance: Record<string, "present" | "absent">;
}

export const activeSessions = new Map<string, ActiveSession>();
