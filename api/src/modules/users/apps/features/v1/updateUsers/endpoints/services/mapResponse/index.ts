import { UserEntity } from "@kishornaik/db";
import { IServiceHandlerAsync, Result, ResultError, ResultFactory, sealed, Service, StatusCodes, tryCatchResultAsync } from "@kishornaik/utils";
import { UpdateUserResponseDto } from "../../../contracts";

export interface IUpdateUserMapResponseService extends IServiceHandlerAsync<UserEntity,UpdateUserResponseDto>{}

@sealed
@Service()
export class UpdateUserMapResponseService implements IUpdateUserMapResponseService{
  public handleAsync(params: UserEntity): Promise<Result<UpdateUserResponseDto, ResultError>> {
    return tryCatchResultAsync(async ()=>{
      // Guard
      if(!params)
        return ResultFactory.error(StatusCodes.BAD_REQUEST, `User entity is required`);

      // Map
      const response:UpdateUserResponseDto=new UpdateUserResponseDto();
      response.identifier=params.identifier;

      return ResultFactory.success(response);
    });
  }

}
