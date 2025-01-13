import { Request, Response, NextFunction } from "express";

type RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

const asyncHandler = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => {
            next(error);
        });
    };
};

export default asyncHandler;
