import { UUID } from 'crypto';

export interface SendReceiverMessageBullMq<T> {
	data: T;
	correlationId?: string; // Optional correlation ID for tracking
}

export interface RequestReplyMessageBullMq<T> {
	data: T;
	correlationId?: string; // Optional correlation ID for tracking
}

export interface ReplyMessageBullMq<T> {
	correlationId?: string;
	success: boolean;
	data?: T;
	message?: string; // Optional message for success or error
	error?: string;
}

export interface TriggerJobMessageBullMq<T> {
	data: T;
	correlationId?: string;
}

export interface TriggerJobOptions {
	jobId: UUID;
	delay?: number | undefined;
	priority?: number | undefined;
	repeat?: {
		cornPattern?: string | undefined;
		limit?: number | undefined;
	};
}
