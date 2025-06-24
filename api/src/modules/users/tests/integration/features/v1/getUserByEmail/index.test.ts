import { describe, it } from 'node:test';
import request from 'supertest';
import expect from 'expect';
import { App } from '@/app';
import { modulesFederation } from '@/modules/app.Module';
import { destroyDatabase, initializeDatabase } from '@kishornaik/db';
import { ValidateEnv } from '@kishornaik/utils';

process.env.NODE_ENV = 'development';
ValidateEnv();

const appInstance = new App([...modulesFederation]);
const app = appInstance.getServer();

describe(`Get-User-By-Email-Integration-Test`, () => {


  //node --trace-deprecation --test --test-name-pattern='should_return_false_when_validation_service_failed' --require ts-node/register -r tsconfig-paths/register ./src/modules/users/tests/integration/features/v1/getUserByEmail/index.test.ts
	it(`should_return_false_when_validation_service_failed`, async () => {
		await initializeDatabase();

		const email:string='ki';

		const response = await request(app).get(`/api/v1/users/${email}`);
    expect(response.body.Success).toBe(false);
		expect(response.statusCode).toBe(400);

		await destroyDatabase();
	});

  //node --trace-deprecation --test --test-name-pattern='should_return_false_when_user_not_found' --require ts-node/register -r tsconfig-paths/register ./src/modules/users/tests/integration/features/v1/getUserByEmail/index.test.ts
	it(`should_return_false_when_user_not_found`, async () => {
		await initializeDatabase();

		const email:string='k1@example.com';

		const response = await request(app).get(`/api/v1/users/${email}`);
    expect(response.body.Success).toBe(false);
		expect(response.statusCode).toBe(404);

		await destroyDatabase();
	});

  //node --trace-deprecation --test --test-name-pattern='should_return_true_when_user_found' --require ts-node/register -r tsconfig-paths/register ./src/modules/users/tests/integration/features/v1/getUserByEmail/index.test.ts
	it(`should_return_true_when_user_found`, async () => {
		await initializeDatabase();

		const email:string='john.doe@example.com';

		const response = await request(app).get(`/api/v1/users/${email}`);
    expect(response.body.Success).toBe(true);
		expect(response.statusCode).toBe(200);

		await destroyDatabase();
	});

});
