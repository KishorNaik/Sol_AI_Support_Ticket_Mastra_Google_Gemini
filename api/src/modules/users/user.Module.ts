import { CreateUserEndpoint } from './apps/features/v1/createUsers';
import { GetUserByEmailIdEndpoint } from './apps/features/v1/getUserByEmailId';
import { RemoveUserEndpoint } from './apps/features/v1/removeUsers';
import { UpdateUserEndpoint } from './apps/features/v1/updateUsers';

export const userModules: Function[] = [
	CreateUserEndpoint,
	GetUserByEmailIdEndpoint,
	UpdateUserEndpoint,
	RemoveUserEndpoint,
];
