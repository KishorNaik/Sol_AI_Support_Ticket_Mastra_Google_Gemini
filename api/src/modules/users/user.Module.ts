import { CreateUserEndpoint } from './apps/features/v1/createUsers';
import { GetUserByEmailIdEndpoint } from './apps/features/v1/getUserByEmailId';
import { UpdateUserEndpoint } from './apps/features/v1/updateUsers';

export const userModules: Function[] = [
	CreateUserEndpoint,
	GetUserByEmailIdEndpoint,
	UpdateUserEndpoint,
];
