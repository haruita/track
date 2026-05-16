export type MediaCreateData = {
  title: string;
  type: string;
  activity: string;
  status: string;
  progressTotal?: number;
  progressUnit: string;
  description?: string;
  imageUrl?: string;
};

export type MediaUpdateData = Partial<MediaCreateData>;

export interface MediaRepository {
  create(data: MediaCreateData): Promise<MediaRecord>;
  findById(id: string): Promise<MediaRecord | null>;
  findAll(query?: string): Promise<MediaRecord[]>;
  update(id: string, data: MediaUpdateData): Promise<MediaRecord>;
  delete(id: string): Promise<void>;
}

export interface MediaRecord {
  id: string;
  title: string;
  type: string;
  activity: string;
  status: string;
  progressTotal: number | null;
  progressUnit: string;
  description: string | null;
  imageUrl: string | null;
}
