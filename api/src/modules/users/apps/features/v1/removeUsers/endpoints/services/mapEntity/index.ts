import { IServiceHandlerAsync, Result, ResultError, ResultFactory, sealed, Service, StatusCodes, StatusEnum, tryCatchResultAsync } from "@kishornaik/utils";
import { RemoveUserRequestDto } from "../../../contracts";
import { UserEntity } from "@kishornaik/db";

export interface IRemoveUserMapEntityService extends IServiceHandlerAsync<RemoveUserRequestDto,UserEntity>{

}

@sealed
@Service()
export class RemoveUserMapEntityService implements IRemoveUserMapEntityService {
  public handleAsync(params: RemoveUserRequestDto): Promise<Result<UserEntity, ResultError>> {
    return tryCatchResultAsync(async ()=>{

      // Guard
      if(!params)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,'Request parameters are required.');

      // Map
      const userEntity=new UserEntity();
      userEntity.identifier=params.identifier;
      userEntity.status=StatusEnum.ACTIVE;

      // Return
      return ResultFactory.success(userEntity);
    });
  }

}
