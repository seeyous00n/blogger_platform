import { Router } from "express";
import { authJwtRefreshGuard } from "../common/middlewares/guards/authJwtRefresh.guard";
import { container } from "../composition-root";
import { SecurityController } from "./security.controller";

const securityController = container.resolve(SecurityController);

const securityRouter = Router();

securityRouter.get('/devices', authJwtRefreshGuard, securityController.getDevices);
securityRouter.delete('/devices', authJwtRefreshGuard, securityController.deleteDevices);
securityRouter.delete('/devices/:id', authJwtRefreshGuard, securityController.deleteDevice);

export { securityRouter };