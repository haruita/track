import { MediaRepository, MediaUpdateData } from "../repositories/MediaRepository";

export class UpdateMediaUseCase {
  constructor(private mediaRepository: MediaRepository) {}

  async execute(id: string, data: MediaUpdateData) {
    return this.mediaRepository.update(id, data);
  }
}
