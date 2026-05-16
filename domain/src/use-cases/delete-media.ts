import { MediaRepository } from "../repositories/MediaRepository";

export class DeleteMediaUseCase {
  constructor(private mediaRepository: MediaRepository) {}

  async execute(id: string) {
    return this.mediaRepository.delete(id);
  }
}
