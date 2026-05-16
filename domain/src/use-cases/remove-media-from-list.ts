import { UserMediaRepository } from "../repositories/UserMediaRepository";

export class RemoveMediaFromListUseCase {
  constructor(private userMediaRepository: UserMediaRepository) {}

  async execute(userMediaId: string, userId: string) {
    const userMedia = await this.userMediaRepository.findById(userMediaId);

    if (!userMedia || userMedia.userId !== userId) {
      throw new Error("Media not found in your list");
    }

    return this.userMediaRepository.delete(userMediaId, userId);
  }
}
