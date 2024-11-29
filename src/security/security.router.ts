import { Router } from "express";
import { authJwtRefreshGuard } from "../common/middlewares/guards/authJwtRefresh.guard";
import { securityController } from "../composition-root";

const securityRouter = Router();

securityRouter.get('/devices', authJwtRefreshGuard, securityController.getDevices);
securityRouter.delete('/devices', authJwtRefreshGuard, securityController.deleteDevices);
securityRouter.delete('/devices/:id', authJwtRefreshGuard, securityController.deleteDevice);

export { securityRouter };