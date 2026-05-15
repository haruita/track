export type Media = {
  id: string;
  title: string;
  type: string;
  activity: string;
  status: string;
  progressCurrent: number;
  progressTotal?: number;
  progressUnit: string;
  description?: string;
  imageUrl?: string;
};
