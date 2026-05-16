import { MediaRepository, MediaCreateData } from "../repositories/MediaRepository";

export class CreateMediaUseCase {
  constructor(private mediaRepository: MediaRepository) {}

  async execute(data: MediaCreateData) {
    return this.mediaRepository.create(data);
  }
}
