export type UserRole = 'citizen' | 'anonymous' | 'moderator' | 'authority' | 'admin';

export type ThemeMode = 'dark' | 'light';

export type ReportCategory =
  | 'corruption'
  | 'bribery'
  | 'public_service'
  | 'police_related'
  | 'road'
  | 'transport'
  | 'water'
  | 'drainage'
  | 'electricity'
  | 'gas'
  | 'environment'
  | 'waste_management'
  | 'healthcare'
  | 'education'
  | 'government_office'
  | 'public_safety'
  | 'infrastructure'
  | 'other';

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus =
  | 'submitted'
  | 'under_review'
  | 'needs_info'
  | 'verified'
  | 'forwarded_to_authority'
  | 'action_pending'
  | 'action_taken'
  | 'resolved'
  | 'rejected'
  | 'duplicate'
  | 'archived';

export type ReportPrivacy = 'public' | 'private_authority' | 'anonymous_public';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  verified: boolean;
  department?: string; // For authorities (e.g. DMP Ramna Thana, Dhaka South City Corp)
  jurisdiction?: string;
}

export interface ReportEvidence {
  id: string;
  name: string;
  fileType: 'image' | 'pdf' | 'document' | 'audio' | 'video';
  fileSize: string; // e.g. "2.4 MB"
  url: string;
  uploadedAt: string;
}

export interface ReportLocation {
  division: string;
  district: string;
  upazila: string;
  unionOrArea: string;
  addressDescription: string;
  latitude: number;
  longitude: number;
  isApproximate: boolean; // Privacy guard for sensitive allegations
}

export interface ReportStatusHistoryItem {
  id: string;
  status: ReportStatus;
  changedBy: string;
  userRole: UserRole;
  timestamp: string;
  comment: string;
}

export interface OfficialResponse {
  id: string;
  authorityName: string;
  officialTitle: string;
  department: string;
  responseText: string;
  actionTakenDetails?: string;
  referenceNo?: string;
  respondedAt: string;
  officialDocumentUrl?: string;
}

export interface ReportComment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  comment: string;
  createdAt: string;
  isOfficial: boolean;
}

export interface CivicReport {
  id: string; // Format: BCW-2026-XXXXXX
  title: string;
  description: string;
  category: ReportCategory;
  severity: ReportSeverity;
  status: ReportStatus;
  privacy: ReportPrivacy;
  location: ReportLocation;
  organizationInvolved?: string;
  submittedAt: string;
  updatedAt: string;
  reporterId?: string; // Hidden if anonymous
  reporterName?: string; // "Anonymous Citizen" if anonymous
  evidence: ReportEvidence[];
  statusHistory: ReportStatusHistoryItem[];
  officialResponse?: OfficialResponse;
  comments: ReportComment[];
  moderationNotes?: string;
  isFlaggedSpam?: boolean;
  upvotesCount: number;
  hasUpvoted?: boolean;
  isBookmarked?: boolean;
}

export interface Division {
  id: string;
  name: string;
  banglaName: string;
  latitude: number;
  longitude: number;
}

export interface District {
  id: string;
  divisionId: string;
  name: string;
  banglaName: string;
  latitude: number;
  longitude: number;
}

export interface Upazila {
  id: string;
  districtId: string;
  name: string;
  banglaName: string;
}

export interface PoliceStation {
  id: string;
  name: string;
  banglaName: string;
  district: string;
  upazila: string;
  division: string;
  address: string;
  latitude: number;
  longitude: number;
  officerInCharge?: string;
  officialPhone: string;
  emergencyPhone: string;
  email?: string;
  jurisdiction: string;
  isActive: boolean;
  lastVerifiedDate: string;
}

export interface AdministrativeOfficial {
  id: string;
  name: string;
  designation: string; // e.g. "Deputy Commissioner (DC)", "UNO", "SP", "Mayor"
  officeName: string;
  district: string;
  upazila?: string;
  division: string;
  officialContact: string;
  officeAddress: string;
  officialWebsite: string;
  officeEmail: string;
  lastVerifiedDate: string;
}

export interface EmergencyContact {
  id: string;
  title: string;
  banglaTitle: string;
  number: string;
  agency: string;
  category: 'national' | 'police' | 'anti_corruption' | 'medical' | 'fire' | 'social_welfare';
  availableHours: string;
  description: string;
  banglaDescription: string;
  isTollFree: boolean;
  lastVerifiedDate: string;
}

export interface NotificationItem {
  id: string;
  reportId?: string;
  title: string;
  message: string;
  type: 'status_update' | 'authority_action' | 'moderation' | 'system';
  timestamp: string;
  isRead: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  targetId: string;
  details: string;
  ipAddress: string;
}

export type Language = 'en' | 'bn';
