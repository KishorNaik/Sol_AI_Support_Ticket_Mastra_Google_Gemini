import { StatusCodes } from "http-status-codes";
import { ResultError, ResultExceptionFactory } from "../../exceptions/results";
import { Result } from "neverthrow";

export const tryCatchAsync=async<T>(action:()=>Promise<Result<T, ResultError>>):Promise<Result<T, ResultError>>=>{
  try
  {
    const result=await action();
    return result;
  }
  catch(ex){
    const error=ex as Error;
    return ResultExceptionFactory.error(StatusCodes.INTERNAL_SERVER_ERROR,error.message);
  }
}
