export interface Attachment {
    attachmentId: number;
    fileName: string;
    filePath: string;
    uploadedAt: string;
    leaveRequest: { leaveRequestId: number };
}