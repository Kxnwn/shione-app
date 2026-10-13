// import api  from "./api.ts";

// export interface ParticipantSummary {
//   researchCode: string;
//   totalSessions: number;
//   totalRecordedUsageSeconds: number;
//   averageSessionDurationSeconds: number;
//   lastSessionStartedAt: string | null;
//   lastSessionEndedAt: string | null;
// }

// export interface ParticipantPagination {
//   page: number;
//   limit: number;
//   totalParticipants: number;
//   totalPages: number;
// }

// export interface ParticipantsResult {
//   pagination: ParticipantPagination;
//   participants: ParticipantSummary[];
// }

// export async function getDashboardParticipants(
//   page = 1,
//   limit = 10
// ) {
//   const response = await api.get<ApiResponse<ParticipantsResult>>(
//     "/admin/dashboard/participants",
//     {
//       params: { page, limit },
//     }
//   );

//   return response.data.data;
// }
