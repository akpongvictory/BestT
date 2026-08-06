import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

import {
  HealthCheckResponse,
  ApiResponse
} from "@bestt/types";

import {
  createApiResponse
} from "@bestt/shared";


const router = Router();



router.get("/", async (_req: Request, res: Response)=>{

  let dbStatus = "disconnected";


  try {

    await prisma.$queryRaw`SELECT 1`;

    dbStatus="connected";


  } catch(error){

    dbStatus="error";

  }



  const healthData: HealthCheckResponse = {

    status:"ok",

    timestamp:new Date().toISOString(),

    uptime:process.uptime(),

    environment:
      process.env.NODE_ENV || "development",

    database:dbStatus

  };



  const response: ApiResponse<HealthCheckResponse> =
    createApiResponse(
      true,
      healthData,
      "BestT server is healthy"
    );



  return res.status(200).json(response);

});


export default router;