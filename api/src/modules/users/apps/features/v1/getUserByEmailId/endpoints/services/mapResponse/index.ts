import { UserEntity } from "@kishornaik/db";
import { IServiceHandlerAsync, Ok, Result, ResultError, ResultExceptionFactory, sealed, Service, StatusCodes, tryCatchAsync } from "@kishornaik/utils";
import { GetUserByEmailIdResponseDto } from "../../../contracts";

export interface IGetUserByEmailIdMapResponseService extends IServiceHandlerAsync<UserEntity,GetUserByEmailIdResponseDto>{}

@sealed
@Service()
export class GetUserByEmailIdMapResponseService implements IGetUserByEmailIdMapResponseService {
  public handleAsync(params: UserEntity): Promise<Result<GetUserByEmailIdResponseDto, ResultError>> {
    return tryCatchAsync(async ()=>{

      // Guard
      if(!params)
        return ResultExceptionFactory.error(StatusCodes.BAD_REQUEST,'User entity is required.');

      // Map
      const response=new GetUserByEmailIdResponseDto();
      response.identifier=params.identifier;
      response.email=params.email;
      response.fullName=params.fullName;

      return new Ok(response);
    });
  }

}
