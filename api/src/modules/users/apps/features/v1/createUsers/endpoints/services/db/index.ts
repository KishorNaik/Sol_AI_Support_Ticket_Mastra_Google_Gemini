import { AddUserDbService, QueryRunner, UserEntity } from "@kishornaik/db";
import { Container, err, IServiceHandlerAsync, Ok, Result, ResultError, ResultExceptionFactory, sealed, Service, StatusCodes } from "@kishornaik/utils";

Container.set<AddUserDbService>(AddUserDbService,new AddUserDbService());

export interface ICreateUserDbServiceParameters{
  user:UserEntity
  queryRunner:QueryRunner;
}

export interface ICreateUserDbService extends IServiceHandlerAsync<ICreateUserDbServiceParameters,UserEntity>{
}

@sealed
@Service()
export class CreateUserDbService implements ICreateUserDbService {
  private readonly _addUserDbService: AddUserDbService;

  public constructor() {
    this._addUserDbService = Container.get<AddUserDbService>(AddUserDbService);
  }
  public async handleAsync(params: ICreateUserDbServiceParameters): Promise<Result<UserEntity, ResultError>> {
    try{
      // Guard
      if(!params)
        return ResultExceptionFactory.error(StatusCodes.BAD_REQUEST, `Parameters are required`);

      if(!params.user)
        return ResultExceptionFactory.error(StatusCodes.BAD_REQUEST, `User entity is required`);

      if(!params.queryRunner)
        return ResultExceptionFactory.error(StatusCodes.BAD_REQUEST, `QueryRunner is required`);

      const user=await this._addUserDbService.handleAsync(params.user,params.queryRunner);
      if(user.isErr()){
        const error=user.error;
        if(error.message.includes(`duplicate key value violates unique constraint`)){
          return ResultExceptionFactory.error(StatusCodes.CONFLICT, `User with this email already exists`);
        }
        return ResultExceptionFactory.error(error.statusCode, error.message);
      }

      return new Ok(user.value);
    }
    catch(ex){
      const error=ex as Error;
      return ResultExceptionFactory.error(StatusCodes.INTERNAL_SERVER_ERROR,error.message);
    }
  }


}

