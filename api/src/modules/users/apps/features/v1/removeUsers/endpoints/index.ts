import { Response } from 'express';
import {
	Body,
	Delete,
	HttpCode,
	JsonController,
	OnUndefined,
	Param,
	Post,
	Put,
	Res,
	UseBefore,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { ValidationMiddleware } from '@/middlewares/security/validations';
import {
	RequestData,
	sealed,
	StatusCodes,
	DataResponse as ApiDataResponse,
	requestHandler,
	RequestHandler,
	DataResponseFactory,
	PipelineWorkflowException,
	PipelineWorkflow,
	Container,
} from '@kishornaik/utils';
import { mediator } from '@/shared/utils/helpers/medaitR';
import { getQueryRunner, UserEntity } from '@kishornaik/db';
import { logger } from '@/shared/utils/helpers/loggers';
import { RemoveUserRequestDto, RemoveUserResponseDto } from '../contracts';
import { RemoveUserRequestValidationService } from './services/validations';
import { RemoveUserMapEntityService } from './services/mapEntity';
import { RemoveUserDbService } from './services/db';
import { RemoveUserMapResponseService } from './services/mapResponse';

// #region Endpoint
@JsonController(`/api/v1/users`)
@OpenAPI({ tags: [`users`] })
export class RemoveUserEndpoint{
  @Delete('/:identifier')
  @OpenAPI({
		summary: `remove user`,
		tags: [`users`],
		description: `remove user`,
	})
  @HttpCode(StatusCodes.OK)
	@OnUndefined(StatusCodes.BAD_REQUEST)
  public async  deleteAsync(@Param('identifier') identifier: string, @Res() res: Response) {
    const request=new RemoveUserRequestDto();
    request.identifier=identifier;

    const response=await mediator.send(new RemoveUserCommand(request));
    return res.status(response.StatusCode).json(response);
  }

}
// #endregion Endpoint

// #region Command
@sealed
class RemoveUserCommand extends RequestData<ApiDataResponse<RemoveUserResponseDto>>{
  private readonly _request: RemoveUserRequestDto;

  public constructor(request: RemoveUserRequestDto) {
    super();
    this._request = request;
  }

  public get request(): RemoveUserRequestDto {
    return this._request;
  }

}
// #endregion Command

// Steps
enum RemoveUserSteps {
  ValidationService = `RemoveUserCommandHandler:Validation Service`,
	MapEntityService = `RemoveUserCommandHandler:Map Entity Service`,
	DbService = `UpdateUserCommandHandler:Db Service`,
	MapResponseService = `UpdateUserCommandHandler:Map Response Service`,
}

// #region Command Handler
@sealed
@requestHandler(RemoveUserCommand)
class RemoveUserCommandHandler implements RequestHandler<RemoveUserCommand,ApiDataResponse<RemoveUserResponseDto>>{

  private pipeline=new PipelineWorkflow(logger);
  private readonly _removeUserValidationService: RemoveUserRequestValidationService;
  private readonly _removeUserMapEntityService:RemoveUserMapEntityService;
  private readonly _removeUserDbService:RemoveUserDbService;
  private readonly _removeUserMapResponseService:RemoveUserMapResponseService;

  public constructor(){
    this._removeUserValidationService=Container.get(RemoveUserRequestValidationService);
    this._removeUserMapEntityService=Container.get(RemoveUserMapEntityService);
    this._removeUserDbService=Container.get(RemoveUserDbService);
    this._removeUserMapResponseService=Container.get(RemoveUserMapResponseService);
  }

  public async handle(value: RemoveUserCommand): Promise<ApiDataResponse<RemoveUserResponseDto>> {
    const queryRunner = getQueryRunner();
		await queryRunner.connect();
    try{

      // Guard
      if(!value)
        return DataResponseFactory.error(StatusCodes.BAD_REQUEST,`command is required`);

      if(!value.request)
        return DataResponseFactory.error(StatusCodes.BAD_REQUEST,`request is required`);

      const {request}=value;
      await queryRunner.startTransaction();

      // Validation Service
      await this.pipeline.step(RemoveUserSteps.ValidationService,async ()=>{
        const result=await this._removeUserValidationService.handleAsync({
          dto:request,
          dtoClass:RemoveUserRequestDto
        });
        return result;
      })

      // Map Entity Service
      await this.pipeline.step(RemoveUserSteps.MapEntityService,async ()=>{
        const result=await this._removeUserMapEntityService.handleAsync(request);
        return result;
      });

      // Db Service
      await this.pipeline.step(RemoveUserSteps.DbService,async ()=>{

        // Get result from Map Entity Pipeline
        const mapEntityUserResult=this.pipeline.getResult<UserEntity>(RemoveUserSteps.MapEntityService);
        const result=await this._removeUserDbService.handleAsync({
          queryRunner:queryRunner,
          user:mapEntityUserResult
        });
        return result;
      });

      // Map Response Service
      await this.pipeline.step(RemoveUserSteps.MapResponseService,()=>{
        const userEntityResult=this.pipeline.getResult<UserEntity>(RemoveUserSteps.DbService);
        const result=this._removeUserMapResponseService.handleAsync(userEntityResult);
        return result;
      })

      await queryRunner.commitTransaction();

      // Return
      const response:RemoveUserResponseDto=this.pipeline.getResult(RemoveUserSteps.MapResponseService);
      return DataResponseFactory.success(StatusCodes.OK,response,'user removed successfully');
    }
    catch(ex){
      return await DataResponseFactory.pipelineError(
				ex as Error | PipelineWorkflowException,
				queryRunner
			);
    }
    finally{
      await queryRunner.release();
    }
  }

}
// #region Command Handler
