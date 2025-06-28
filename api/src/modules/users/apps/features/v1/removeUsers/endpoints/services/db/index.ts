import { DeleteUserDbService, UserEntity } from "@kishornaik/db";
import { CannotAttachTreeChildrenEntityError, Container, IServiceHandlerAsync, QueryRunner, Result, ResultError, ResultFactory, sealed, Service, StatusCodes, tryCatchResultAsync } from "@kishornaik/utils";

Container.set<DeleteUserDbService>(DeleteUserDbService,new DeleteUserDbService());

export interface IRemoveUserDbServiceParameters{
  user:UserEntity;
  queryRunner:QueryRunner;
}

export interface IRemoveUserDbService extends IServiceHandlerAsync<IRemoveUserDbServiceParameters,UserEntity>{}

@sealed
@Service()
export class RemoveUserDbService implements IRemoveUserDbService {

  private readonly _deleteUserDbService:DeleteUserDbService;

  public constructor(){
    this._deleteUserDbService=Container.get(DeleteUserDbService);
  }


  public handleAsync(params: IRemoveUserDbServiceParameters): Promise<Result<UserEntity, ResultError>> {
    return tryCatchResultAsync(async ()=>{
      // Guard
      if(!params)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,'Request parameters are required.');

      if(!params.queryRunner)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,'Query runner is required.');

      if(!params.user)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,'User is required.');

      const {queryRunner,user}=params;

      // Delete Command
      const result=await this._deleteUserDbService.handleAsync(user,queryRunner);
      return result;
    })
  }

}
