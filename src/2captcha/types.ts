import { z } from 'zod';

export const zInResponse = z.object({
    status: z.number().min(0).max(1),
    request: z.string(),
});

export const zResResponse = zInResponse.extend({});
