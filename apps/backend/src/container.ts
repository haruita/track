import { RegisterUserUseCase } from "../../../domain/src/use-cases/register-user";
import { LoginUserUseCase } from "../../../domain/src/use-cases/login-user";
import { CreateMediaUseCase } from "../../../domain/src/use-cases/create-media";
import { UpdateMediaUseCase } from "../../../domain/src/use-cases/update-media";
import { DeleteMediaUseCase } from "../../../domain/src/use-cases/delete-media";
import { AddMediaToListUseCase } from "../../../domain/src/use-cases/add-media-to-list";
import { UpdateMediaProgressUseCase } from "../../../domain/src/use-cases/update-media-progress";
import { RemoveMediaFromListUseCase } from "../../../domain/src/use-cases/remove-media-from-list";
import { PrismaUserRepository } from "./repositories/PrismaUserRepository";
import { PrismaMediaRepository } from "./repositories/PrismaMediaRepository";
import { PrismaUserMediaRepository } from "./repositories/PrismaUserMediaRepository";
import { BcryptPasswordHasher } from "./repositories/BcryptPasswordHasher";

const userRepository = new PrismaUserRepository();
const mediaRepository = new PrismaMediaRepository();
const userMediaRepository = new PrismaUserMediaRepository();
const passwordHasher = new BcryptPasswordHasher();

export const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  passwordHasher
);

export const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  passwordHasher
);

export const createMediaUseCase = new CreateMediaUseCase(mediaRepository);
export const updateMediaUseCase = new UpdateMediaUseCase(mediaRepository);
export const deleteMediaUseCase = new DeleteMediaUseCase(mediaRepository);

export const addMediaToListUseCase = new AddMediaToListUseCase(
  userMediaRepository,
  mediaRepository
);

export const updateMediaProgressUseCase = new UpdateMediaProgressUseCase(
  userMediaRepository
);

export const removeMediaFromListUseCase = new RemoveMediaFromListUseCase(
  userMediaRepository
);

export { userRepository, mediaRepository, userMediaRepository };
