import { ProgrammingLanguageEntity } from '@kishornaik/db';
import {
	Container,
	IServiceHandlerAsync,
	QueryRunner,
	Result,
	ResultError,
	ResultFactory,
	sealed,
	Service,
	StatusCodes,
	StatusEnum,
	tryCatchResultAsync,
} from '@kishornaik/utils';
import { CreateProgrammingLanguageResponseDto } from '../../../contracts';

export interface ICreateProgrammingLanguageMapEntityService
	extends IServiceHandlerAsync<ProgrammingLanguageEntity, CreateProgrammingLanguageResponseDto> {}

@sealed
@Service()
export class CreateProgrammingLanguageMapResponseService
	implements ICreateProgrammingLanguageMapEntityService
{
	public handleAsync(
		params: ProgrammingLanguageEntity
	): Promise<Result<CreateProgrammingLanguageResponseDto, ResultError>> {
		return tryCatchResultAsync(async () => {
			// Guard
			if (!params)
				return ResultFactory.error(
					StatusCodes.BAD_REQUEST,
					'Programming Language entity is required.'
				);

			// Map Response
			const response: CreateProgrammingLanguageResponseDto =
				new CreateProgrammingLanguageResponseDto();
			response.identifier = params.identifier;

			// Return
			return ResultFactory.success(response);
		});
	}
}
