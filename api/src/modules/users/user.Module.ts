import { CreateUserEndpoint } from './apps/features/v1/createUsers';
import { GetUserByEmailIdEndpoint } from './apps/features/v1/getUserByEmailId';

export const userModules: Function[] = [CreateUserEndpoint, GetUserByEmailIdEndpoint];
