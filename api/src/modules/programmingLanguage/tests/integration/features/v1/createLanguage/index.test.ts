import { describe, it } from 'node:test';
import request from 'supertest';
import expect from 'expect';
import { App } from '@/app';
import { modulesFederation } from '@/modules/app.Module';
import { destroyDatabase, initializeDatabase } from '@kishornaik/db';
import { ValidateEnv } from '@kishornaik/utils';
import { CreateProgrammingLanguageRequestDto } from '../../../../../apps/features/v1/createLanguage';

process.env.NODE_ENV = 'development';
ValidateEnv();

const appInstance = new App([...modulesFederation]);
const app = appInstance.getServer();

describe(`Create-Programming-Language-Integration-Test`, () => {
	//node --trace-deprecation --test --test-name-pattern='should_return_false_when_validation_service_failed' --require ts-node/register -r tsconfig-paths/register ./src/modules/programmingLanguage/tests/integration/features/v1/createLanguage/index.test.ts
	it(`should_return_false_when_validation_service_failed`, async () => {
		await initializeDatabase();

		const requestBody = new CreateProgrammingLanguageRequestDto();
		requestBody.name = '';

		const response = await request(app).post('/api/v1/programming-language').send(requestBody);
		expect(response.body.Success).toBe(false);
		expect(response.statusCode).toBe(400);

		await destroyDatabase();
	});

	//node --trace-deprecation --test --test-name-pattern='should_return_false_when_language_already_exists' --require ts-node/register -r tsconfig-paths/register ./src/modules/programmingLanguage/tests/integration/features/v1/createLanguage/index.test.ts
	it(`should_return_false_when_language_already_exists`, async () => {
		await initializeDatabase();

		const requestBody = new CreateProgrammingLanguageRequestDto();
		requestBody.name = 'c';

		const response = await request(app).post('/api/v1/programming-language').send(requestBody);
		console.log(`body`, response.body);
		expect(response.body.Success).toBe(false);
		expect(response.statusCode).toBe(409);

		await destroyDatabase();
	});

  //node --trace-deprecation --test --test-name-pattern='should_return_true_when_all_services_are_passed' --require ts-node/register -r tsconfig-paths/register ./src/modules/programmingLanguage/tests/integration/features/v1/createLanguage/index.test.ts
	it(`should_return_true_when_all_services_are_passed`, async () => {
		await initializeDatabase();

		const requestBody = new CreateProgrammingLanguageRequestDto();
		requestBody.name = 'c++';

		const response = await request(app).post('/api/v1/programming-language').send(requestBody);
		console.log(`body`, response.body);
		expect(response.body.Success).toBe(true);
		expect(response.statusCode).toBe(201);

		await destroyDatabase();
	});
});
