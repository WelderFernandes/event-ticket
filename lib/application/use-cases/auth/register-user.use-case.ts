import { User, CreateUserData } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/repositories/user.repository";

export interface RegisterUserUseCase {
  execute(data: CreateUserData): Promise<User>;
}

export class RegisterUserUseCaseImpl implements RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserData): Promise<User> {
    // Verificar se o usuário já existe
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Usuário já existe com este email");
    }

    // Criar o usuário
    return await this.userRepository.create(data);
  }
}
