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
import { CreateUsersRequestDto, CreateUsersResponseDto } from '../contracts';
import { mediator } from '@/shared/utils/helpers/medaitR';
import { getQueryRunner } from '@kishornaik/db';
import { logger } from '@/shared/utils/helpers/loggers';
import { CreateUserMapEntityService } from './services/mapEntity';
import { CreateUserDbService } from './services/db';
import { CreateMapResponseService } from './services/mapResponse';

@JsonController(`/api/v1/users`)
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
class CreateUserCommandHandler
	implements RequestHandler<CreateUserCommand, ApiDataResponse<CreateUsersResponseDto>>
{
	private pipeline = new PipelineWorkflow(logger);
	private readonly _createUserMapEntityService: CreateUserMapEntityService;
	private readonly _createUserDbService: CreateUserDbService;
	private readonly _createMapResponseService: CreateMapResponseService;

	public constructor() {
		this._createUserMapEntityService = Container.get(CreateUserMapEntityService);
		this._createUserDbService = Container.get(CreateUserDbService);
		this._createMapResponseService = Container.get(CreateMapResponseService);
	}

	public async handle(
		value: CreateUserCommand
	): Promise<ApiDataResponse<CreateUsersResponseDto>> {
		const queryRunner = getQueryRunner();
		await queryRunner.connect();

		try {
			// Guard
			if (!value)
				return DataResponseFactory.error(StatusCodes.BAD_REQUEST, `Value is required`);

			if (!value.request)
				return DataResponseFactory.error(StatusCodes.BAD_REQUEST, `Request is required`);

			const { request } = value;

			// Map Entity Service:; Pipeline Workflow
			const userMapResult = await this.pipeline.step(
				`CreateUserEndpoint:Map User Entity pipeline`,
				async () => {
					const result = await this._createUserMapEntityService.handleAsync(request);
					return result;
				}
			);

			await queryRunner.startTransaction();
			// Add User Db Service Pipeline
			const dbUserResult = await this.pipeline.step(
				`CreateUserEndpoint:Add User Db pipeline`,
				async () => {
					const result = await this._createUserDbService.handleAsync({
						user: userMapResult,
						queryRunner: queryRunner,
					});
					return result;
				}
			);

			// Response Service Pipeline
			const response = await this.pipeline.step(
				`CreateUserEndpoint:Map Response pipeline`,
				async () => {
					const result = await this._createMapResponseService.handleAsync(dbUserResult);
					return result;
				}
			);
			await queryRunner.commitTransaction();

			return DataResponseFactory.success(
				StatusCodes.CREATED,
				response,
				`User created successfully`
			);
		} catch (ex) {
			return DataResponseFactory.pipelineError(ex, queryRunner);
		} finally {
			await queryRunner.release();
		}
	}
}
