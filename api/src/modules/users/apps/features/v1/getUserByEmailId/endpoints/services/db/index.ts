import { GetUserByEmailDbService, GetUserByEmailIdDbDto, UserEntity } from "@kishornaik/db";
import { Container, IServiceHandlerAsync, QueryRunner, Result, ResultError, ResultExceptionFactory, sealed, Service, StatusCodes } from "@kishornaik/utils";

Container.set<GetUserByEmailDbService>(GetUserByEmailDbService, new GetUserByEmailDbService());

export interface GetUserByEmailIdDbQueryServiceParameters{
  user:GetUserByEmailIdDbDto;
  queryRunner?:QueryRunner;
}

export interface IGetUserByEmailIdDbQueryService extends IServiceHandlerAsync<GetUserByEmailIdDbQueryServiceParameters,UserEntity>{}

@sealed
@Service()
export class GetUserByEmailIdDbQueryService implements IGetUserByEmailIdDbQueryService {

  private readonly _getUserByEmailDbService:GetUserByEmailDbService;

  public constructor() {
    this._getUserByEmailDbService = Container.get(GetUserByEmailDbService);
  }

  public async handleAsync(params: GetUserByEmailIdDbQueryServiceParameters): Promise<Result<UserEntity, ResultError>> {
    try
    {
      // Guard
      if(!params)
        return ResultExceptionFactory.error(StatusCodes.BAD_REQUEST,'Request parameters are required');

      if(!params.user)
        return ResultExceptionFactory.error(StatusCodes.BAD_REQUEST,'User is required');

      if(!params.queryRunner)
        return ResultExceptionFactory.error(StatusCodes.BAD_REQUEST,'QueryRunner is required');

      const {user, queryRunner}=params;

      const result=await this._getUserByEmailDbService.handleAsync({
        user:user,
        queryRunner:queryRunner
      });

      return result;
    }
    catch(ex){
      const error=ex as Error;
      return ResultExceptionFactory.error(StatusCodes.INTERNAL_SERVER_ERROR,error.message);
    }
  }

}
