import { MediaRecord } from "./MediaRepository";

export interface UserMediaRecord {
  id: string;
  userId: string;
  mediaId: string;
  progressCurrent: number;
  media: MediaRecord;
}

export type UpdateProgressAction =
  | { action: "increment" }
  | { action: "decrement" }
  | { action: "set"; value: number };

export interface UserMediaRepository {
  findByUserId(userId: string): Promise<UserMediaRecord[]>;
  findById(id: string): Promise<UserMediaRecord | null>;
  findByUserAndMedia(userId: string, mediaId: string): Promise<UserMediaRecord | null>;
  create(userId: string, mediaId: string): Promise<UserMediaRecord>;
  updateProgress(id: string, action: UpdateProgressAction, maxProgress: number): Promise<UserMediaRecord>;
  delete(id: string, userId: string): Promise<void>;
}
