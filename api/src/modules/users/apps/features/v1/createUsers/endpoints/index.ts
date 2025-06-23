import { Response } from 'express';
import {
	Body,
	HttpCode,
	JsonController,
	OnUndefined,
	Post,
	Res,
	UseBefore,
} from 'routing-controllers';
import { getQueryParams, OpenAPI } from 'routing-controllers-openapi';
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
import { CreateUsersRequestDto, CreateUsersResponseDto } from '../contracts';
import { mediator } from '@/shared/utils/helpers/medaitR';
import { getQueryRunner } from '@kishornaik/db';
import { logger } from '@/shared/utils/helpers/loggers';
import { CreateUserMapEntityService } from './services/mapEntity';

@JsonController(`api/v1/users`)
@OpenAPI({ tags: [`users`] })
export class CreateUserEndpoint {
	@Post()
	@OpenAPI({
		summary: `Create User`,
		tags: [`users`],
		description: `Create a new user in the system.`,
	})
	@HttpCode(StatusCodes.OK)
	@OnUndefined(StatusCodes.BAD_REQUEST)
	@UseBefore(ValidationMiddleware(CreateUsersRequestDto))
	public async postAsync(@Body() request: CreateUsersRequestDto, @Res() res: Response) {
		const response = await mediator.send(new CreateUserCommand(request));
		return res.status(response.StatusCode).json(response);
	}
}

class CreateUserCommand extends RequestData<ApiDataResponse<CreateUsersResponseDto>> {
	private readonly _request: CreateUsersRequestDto;

	public constructor(request: CreateUsersRequestDto) {
		super();
		this._request = request;
	}

	public get request(): CreateUsersRequestDto {
		return this._request;
	}
}

@sealed
@requestHandler(CreateUserCommand)
class CreateUserCommandHandler implements RequestHandler<CreateUserCommand,ApiDataResponse<CreateUsersResponseDto>>{

  private createUserPipeline=new PipelineWorkflow(logger);
  private readonly _createUserMapEntityService:CreateUserMapEntityService;

  public constructor(){
    this._createUserMapEntityService=Container.get(CreateUserMapEntityService);
  }

  public async handle(value: CreateUserCommand): Promise<ApiDataResponse<CreateUsersResponseDto>> {
    const queryRunner=getQueryRunner();
    await queryRunner.connect();

    try
    {

      const {request}=value;

      // Map Entity Service:; Pipeline Workflow
      const  mapEntityResult=await this.createUserPipeline.step(`Map User Entity pipeline`, async () => {
        const result=await this._createUserMapEntityService.handleAsync(request);
        return result;
      });

      await queryRunner.startTransaction();
      // Add User Db Service

      // Response Service
    }
    catch(ex){
      const error= ex as Error| PipelineWorkflowException;

      if(error instanceof PipelineWorkflowException) {
        if(queryRunner.isTransactionActive){
          await queryRunner.rollbackTransaction();
        }
        return DataResponseFactory.error(error.statusCode, error.message);
      }

      return DataResponseFactory.error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
    finally{
      await queryRunner.release();
    }
  }

}
