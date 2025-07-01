import { Container, IServiceHandlerAsync, QueryRunner, Result, ResultError, ResultFactory, sealed, Service, StatusCodes, StatusEnum, tryCatchResultAsync } from "@kishornaik/utils";
import { AddProgrammingLanguageDbService, ProgrammingLanguageEntity } from "@kishornaik/db";

Container.set<AddProgrammingLanguageDbService>(AddProgrammingLanguageDbService, new AddProgrammingLanguageDbService());

export interface ICreateProgrammingLanguageDbServiceParameters{
  entity: ProgrammingLanguageEntity;
  queryRunner: QueryRunner;
}

export interface ICreateProgrammingLanguageDbService extends IServiceHandlerAsync<ICreateProgrammingLanguageDbServiceParameters,ProgrammingLanguageEntity>{}


@sealed
@Service()
export class CreateProgrammingLanguageDbService implements ICreateProgrammingLanguageDbService{

  private readonly _addProgrammingLanguageDbService:AddProgrammingLanguageDbService;

  public constructor(){
    this._addProgrammingLanguageDbService = Container.get(AddProgrammingLanguageDbService);
  }

  public handleAsync(params: ICreateProgrammingLanguageDbServiceParameters): Promise<Result<ProgrammingLanguageEntity, ResultError>> {
    return tryCatchResultAsync(async ()=>{
      // Guard
      if(!params)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,'Request parameters are required.');

      if(!params.entity)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,'Entity is required.');

      if(!params.queryRunner)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,'Query runner is required.');

      // Destructuring
      const {entity,queryRunner}=params;

      // Db
      const result = await this._addProgrammingLanguageDbService.handleAsync(entity,queryRunner);
      if(result.isErr())
      {
        const error = result.error;
        if(error.message.includes(`duplicate key value violates unique constraint`)){
          return ResultFactory.error(StatusCodes.CONFLICT,`Programming Language with this name already exists.`);
        }
        return ResultFactory.error(error.statusCode,error.message);
      }

      return ResultFactory.success(result.value);
    });
  }

}
