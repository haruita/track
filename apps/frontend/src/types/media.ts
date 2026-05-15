export type Media = {
  id: string;
  title: string;
  type: string;
  activity: string;
  status: string;
  progressTotal?: number;
  progressUnit: string;
  description?: string;
  imageUrl?: string;
};

export type UserMedia = {
  id: string;
  userId: string;
  mediaId: string;
  progressCurrent: number;
  media: Media;
};
