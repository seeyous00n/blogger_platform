import { Router } from "express";
import { securityController } from "./security.controller";
import { authJwtRefreshGuard } from "../common/middlewares/guards/authJwtRefresh.guard";

const securityRouter = Router();

securityRouter.get('/devices', authJwtRefreshGuard, securityController.getDevices);
securityRouter.delete('/devices', authJwtRefreshGuard, securityController.deleteDevices);
securityRouter.delete('/devices/:id', authJwtRefreshGuard, securityController.deleteDevice);

export { securityRouter };