import { describe, it } from 'node:test';
import request from 'supertest';
import expect from 'expect';

import { App } from '@/app';
import { modulesFederation } from '@/modules/app.Module';
import { destroyDatabase, initializeDatabase } from '@kishornaik/db';
import { ValidateEnv } from '@kishornaik/utils';
import { UpdateUserRequestDto } from '@/modules/users/apps/features/v1/updateUsers';

process.env.NODE_ENV = 'development';
ValidateEnv();

const appInstance = new App([...modulesFederation]);
const app = appInstance.getServer();

describe(`Update-User-Integration-Test`, () => {

  //node --trace-deprecation --test --test-name-pattern='should_return_false_when_validation_service_failed' --require ts-node/register -r tsconfig-paths/register ./src/modules/users/tests/integration/features/v1/updateUsers/index.test.ts
	it(`should_return_false_when_validation_service_failed`, async () => {
		await initializeDatabase();

		const requestBody = new UpdateUserRequestDto();
    requestBody.identifier=``;
		requestBody.fullName = '';
		requestBody.email = '';

		const response = await request(app).put('/api/v1/users').send(requestBody);
		expect(response.body.Success).toBe(false);
		expect(response.statusCode).toBe(400);

		await destroyDatabase();
	});

  //node --trace-deprecation --test --test-name-pattern='should_return_false_when_user_already_exists' --require ts-node/register -r tsconfig-paths/register ./src/modules/users/tests/integration/features/v1/updateUsers/index.test.ts
	it(`should_return_false_when_user_already_exists`, async () => {
		await initializeDatabase();

		const requestBody = new UpdateUserRequestDto();
    requestBody.identifier=`79414171-f556-4ce0-9a2e-f16ad5f6bc9f`;
		requestBody.fullName = 'Jon Doe';
		requestBody.email = 'mary.doe@example.com';

		const response = await request(app).put('/api/v1/users').send(requestBody);
		expect(response.body.Success).toBe(false);
		expect(response.statusCode).toBe(409);

		await destroyDatabase();
	});

  //node --trace-deprecation --test --test-name-pattern='should_return_true_when_user_updated' --require ts-node/register -r tsconfig-paths/register ./src/modules/users/tests/integration/features/v1/updateUsers/index.test.ts
	it(`should_return_true_when_user_updated`, async () => {
		await initializeDatabase();

		const requestBody = new UpdateUserRequestDto();
    requestBody.identifier=`79414171-f556-4ce0-9a2e-f16ad5f6bc9f`;
		requestBody.fullName = 'Jon Doe';
		requestBody.email = 'jon.doe@example.com';

		const response = await request(app).put('/api/v1/users').send(requestBody);
		expect(response.body.Success).toBe(true);
		expect(response.statusCode).toBe(200);

		await destroyDatabase();
	});
});
