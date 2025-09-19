import { User } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/repositories/user.repository";

export interface AuthenticateUserData {
  email: string;
  password: string;
}

export interface AuthenticateUserUseCase {
  execute(data: AuthenticateUserData): Promise<User>;
}

export class AuthenticateUserUseCaseImpl implements AuthenticateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: AuthenticateUserData): Promise<User> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    // Aqui você implementaria a verificação de senha
    // Por enquanto, retornamos o usuário (BetterAuth cuidará da autenticação)
    return user;
  }
}
