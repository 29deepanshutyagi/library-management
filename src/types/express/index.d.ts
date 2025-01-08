import { User } from "@prisma/client";
import { Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export type AsyncRequestHandler<
  P = {},
  ResBody = any,
  ReqBody = {},
  ReqQuery = {},
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
) => Promise<any>;

export {};
