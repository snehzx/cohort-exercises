export interface ActiveSession {
  classId: string | null;
  startedAt: string | null;
  attendance: Record<string, "present" | "absent">;
}

export const activeSessions = new Map<string, ActiveSession>();
