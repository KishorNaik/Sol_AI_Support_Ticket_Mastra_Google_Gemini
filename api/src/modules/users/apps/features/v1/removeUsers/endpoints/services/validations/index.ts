import { DtoValidation, sealed, Service } from '@kishornaik/utils';
import { RemoveUserRequestDto } from '../../../contracts';

@sealed
@Service()
export class RemoveUserRequestValidationService extends DtoValidation<RemoveUserRequestDto> {
	public constructor() {
		super();
	}
}
