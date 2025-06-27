import { EditUserDbService, UserEntity } from "@kishornaik/db";
import { Container, IServiceHandlerAsync, QueryRunner, Result, ResultError, ResultFactory, sealed, Service, StatusCodes, tryCatchResultAsync } from "@kishornaik/utils";

Container.set<EditUserDbService>(EditUserDbService, new EditUserDbService());

export interface IUpdateUserDbServiceParameters{
  user:UserEntity;
  queryRunner:QueryRunner;
}

export interface IUpdateUserDbService extends IServiceHandlerAsync<IUpdateUserDbServiceParameters,UserEntity>{}

@sealed
@Service()
export class UpdateUserDbService implements IUpdateUserDbService{

  private readonly _editUserDbService:EditUserDbService;

  public constructor(){
    this._editUserDbService=Container.get(EditUserDbService);
  }

  public handleAsync(params: IUpdateUserDbServiceParameters): Promise<Result<UserEntity, ResultError>> {
    return tryCatchResultAsync(async ()=>{

      // Guard
      if(!params)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,`Request parameters are required`);

      if(!params.user)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,`User entity is required`);

      if(!params.queryRunner)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,`QueryRunner is required`);

      const {queryRunner,user}=params;

      // Db
      const result=await this._editUserDbService.handleAsync(user,queryRunner);
      if(result.isErr()){
        const error=result.error;
        if(error.message.includes(`duplicate key value violates unique constraint`)){
          return ResultFactory.error(StatusCodes.CONFLICT,`User with this email already exists`);
        }
        return ResultFactory.error(error.statusCode,error.message);
      }

      return result;
    });
  }

}
