import { sealed, Service } from '@kishornaik/utils';
import { ProgrammingLanguageEntity } from '../../../../infrastructure/entity/programmingLanguage';
import { AddService } from '../../../../../../shared/services/db/add';

@sealed
@Service()
export class AddProgrammingLanguageDbService extends AddService<ProgrammingLanguageEntity> {
	public constructor() {
		super(ProgrammingLanguageEntity);
	}
}
