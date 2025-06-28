import { sealed, Service } from '@kishornaik/utils';
import { DeleteService } from '../../../../../../shared/services/db/delete';
import { UserEntity } from '../../../../users.Module';

@sealed
@Service()
export class DeleteUserDbService extends DeleteService<UserEntity> {
	public constructor() {
		super(UserEntity);
	}
}
