import { StatusCodes } from "http-status-codes";
import { ResultError, ResultExceptionFactory } from "../../exceptions/results";
import { Result } from "neverthrow";

export const tryCatchResultAsync=async<T>(onTry:()=>Promise<Result<T, ResultError>>):Promise<Result<T, ResultError>>=>{
  try
  {
    if(!onTry)
      return ResultExceptionFactory.error(StatusCodes.BAD_REQUEST,'Action is required');
    const result=await onTry();
    return result;
  }
  catch(ex){
    const error=ex as Error;
    return ResultExceptionFactory.error(StatusCodes.INTERNAL_SERVER_ERROR,error.message);
  }
}

export const tryCatchFinallyResultAsync = async <T>(
  onTry: () => Promise<Result<T, ResultError>>,
  onFinally?: () => void | Promise<void>
): Promise<Result<T, ResultError>> => {
  try {
    if(!onTry)
      return ResultExceptionFactory.error(StatusCodes.BAD_REQUEST,'Action is required');
    const result = await onTry();
    return result;
  } catch (ex) {
    const error = ex as Error;
    return ResultExceptionFactory.error(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
  } finally {
    if (onFinally) {
      await onFinally();
    }
  }
};
