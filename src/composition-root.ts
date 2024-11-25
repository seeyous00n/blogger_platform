import { AuthController } from "./auth/auth.controller";
import { AuthRepository } from "./auth/auth.repository";
import { AuthService } from "./auth/auth.service";


const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
export const authController = new AuthController(authService);