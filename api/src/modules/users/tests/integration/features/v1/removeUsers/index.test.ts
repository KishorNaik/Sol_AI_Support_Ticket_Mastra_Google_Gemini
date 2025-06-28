import { describe, it } from 'node:test';
import request from 'supertest';
import expect from 'expect';
import { App } from '@/app';
import { modulesFederation } from '@/modules/app.Module';
import { destroyDatabase, initializeDatabase } from '@kishornaik/db';
import { ValidateEnv } from '@kishornaik/utils';
import { RemoveUserRequestDto } from '../../../../../apps/features/v1/removeUsers';

process.env.NODE_ENV = 'development';
ValidateEnv();

const appInstance = new App([...modulesFederation]);
const app = appInstance.getServer();

describe(`Remove-User-Integration-Test`, () => {
  //node --trace-deprecation --test --test-name-pattern='should_return_false_when_validation_service_failed' --require ts-node/register -r tsconfig-paths/register ./src/modules/users/tests/integration/features/v1/removeUsers/index.test.ts
	it(`should_return_false_when_validation_service_failed`, async () => {
		await initializeDatabase();

		const requestBody = new RemoveUserRequestDto();
		requestBody.identifier = `test`;

		const response = await request(app).delete(`/api/v1/users/${requestBody.identifier}`)
    console.log(`response body: ${JSON.stringify(response.body)}`);
		expect(response.body.Success).toBe(false);
		expect(response.statusCode).toBe(400);

		await destroyDatabase();
	});

  //node --trace-deprecation --test --test-name-pattern='should_return_false_when_identifier_provided_wrong' --require ts-node/register -r tsconfig-paths/register ./src/modules/users/tests/integration/features/v1/removeUsers/index.test.ts
	it(`should_return_false_when_identifier_provided_wrong`, async () => {
		await initializeDatabase();

		const requestBody = new RemoveUserRequestDto();
		requestBody.identifier = `230849ec-2565-4016-b21d-e21243affc4d`;

		const response = await request(app).delete(`/api/v1/users/${requestBody.identifier}`)
    console.log(`response body: ${JSON.stringify(response.body)}`);
		expect(response.body.Success).toBe(false);
		expect(response.statusCode).toBe(404);

		await destroyDatabase();
	});

  //node --trace-deprecation --test --test-name-pattern='should_return_true_when_all_services_are_passed_successfully' --require ts-node/register -r tsconfig-paths/register ./src/modules/users/tests/integration/features/v1/removeUsers/index.test.ts
	it(`should_return_true_when_all_services_are_passed_successfully`, async () => {
		await initializeDatabase();

		const requestBody = new RemoveUserRequestDto();
		requestBody.identifier = `230849ec-2565-4016-b21d-e21243affc4c`;

		const response = await request(app).delete(`/api/v1/users/${requestBody.identifier}`)
    console.log(`response body: ${JSON.stringify(response.body)}`);
		expect(response.body.Success).toBe(true);
		expect(response.statusCode).toBe(200);

		await destroyDatabase();
	});

  //node --trace-deprecation --test --test-name-pattern='should_return_false_when_user_already_removed' --require ts-node/register -r tsconfig-paths/register ./src/modules/users/tests/integration/features/v1/removeUsers/index.test.ts
	it(`should_return_false_when_user_already_removed`, async () => {
		await initializeDatabase();

		const requestBody = new RemoveUserRequestDto();
		requestBody.identifier = `230849ec-2565-4016-b21d-e21243affc4c`;

		const response = await request(app).delete(`/api/v1/users/${requestBody.identifier}`)
    console.log(`response body: ${JSON.stringify(response.body)}`);
		expect(response.body.Success).toBe(false);
		expect(response.statusCode).toBe(404);

		await destroyDatabase();
	});
});
