import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/shared/utils/exceptions/http';
import { DataResponseFactory } from '@kishornaik/utils';

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export const ValidationMiddleware = (
	type: any,
	skipMissingProperties = false,
	whitelist = false,
	forbidNonWhitelisted = false
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const dto = plainToInstance(type, { ...req.body, ...req.params, ...req.query } as any);
		validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
			.then(() => {
				req.body = dto;
				next();
			})
			.catch((errors: ValidationError[]) => {
				const message = errors
					.map((error: ValidationError) => Object.values(error.constraints))
					.join(', ');
				const dataResponse = DataResponseFactory.response(false, 400, undefined, message);
				next(dataResponse);
			});
	};
};
