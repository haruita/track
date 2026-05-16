import { UserMediaRepository, UpdateProgressAction } from "../repositories/UserMediaRepository";

export class UpdateMediaProgressUseCase {
  constructor(private userMediaRepository: UserMediaRepository) {}

  async execute(
    userMediaId: string,
    userId: string,
    action: UpdateProgressAction,
    maxProgress: number
  ) {
    const userMedia = await this.userMediaRepository.findById(userMediaId);

    if (!userMedia || userMedia.userId !== userId) {
      throw new Error("Media not found in your list");
    }

    return this.userMediaRepository.updateProgress(
      userMediaId,
      action,
      maxProgress
    );
  }
}
