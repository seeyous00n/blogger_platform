import { Router } from "express";
import { securityController } from "./security.controller";

const securityRouter = Router();

securityRouter.get('/devices', securityController.getDevices);
securityRouter.delete('/devices', securityController.deleteDevice);
securityRouter.delete('/devices/:id', securityController.deleteDevices);

export { securityRouter };