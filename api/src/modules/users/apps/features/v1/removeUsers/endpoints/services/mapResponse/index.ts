import { UserEntity } from "@kishornaik/db";
import { IServiceHandlerAsync, Result, ResultError, ResultFactory, sealed, Service, StatusCodes, tryCatchResultAsync } from "@kishornaik/utils";
import { RemoveUserResponseDto } from "../../../contracts";

export interface IRemoveUserResponseService extends IServiceHandlerAsync<UserEntity,RemoveUserResponseDto>{}

@sealed
@Service()
export class RemoveUserMapResponseService implements IRemoveUserResponseService{
  public handleAsync(params: UserEntity): Promise<Result<RemoveUserResponseDto, ResultError>> {
    return tryCatchResultAsync(async ()=>{
      // Guard
      if(!params)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,'Request parameters are required.');

      // Map
      const userResponseDto=new RemoveUserResponseDto();
      userResponseDto.identifier=params.identifier;

      // Return
      return ResultFactory.success(userResponseDto);
    });
  }
}
