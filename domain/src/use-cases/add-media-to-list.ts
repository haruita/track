import { MediaRepository } from "../repositories/MediaRepository";
import { UserMediaRepository } from "../repositories/UserMediaRepository";

export class AddMediaToListUseCase {
  constructor(
    private userMediaRepository: UserMediaRepository,
    private mediaRepository: MediaRepository
  ) {}

  async execute(userId: string, mediaId: string) {
    const existing = await this.userMediaRepository.findByUserAndMedia(
      userId,
      mediaId
    );

    if (existing) {
      throw new Error("Media already in your list");
    }

    const media = await this.mediaRepository.findById(mediaId);
    if (!media) {
      throw new Error("Media not found");
    }

    return this.userMediaRepository.create(userId, mediaId);
  }
}
