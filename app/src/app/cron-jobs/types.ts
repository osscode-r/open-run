import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const cronJobSchema = z.object({
    id: z.string().uuid(),
    schedule: z.string(),
    command: z.string(),
    description: z.string().optional(),
    name: z.string(),
    bash_script: z.string().optional(),
    user_id: z.string().uuid(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    is_active: z.boolean(),
    last_run_at: z.string().datetime().optional(),
});

export type CronJob = z.infer<typeof cronJobSchema>;

export const createCronJobRequestSchema = z.object({
    schedule: z.string(),
    command: z.string(),
    description: z.string().optional(),
    name: z.string(),
    bash_script: z.string().optional(),
});

export type CreateCronJobRequest = z.infer<typeof createCronJobRequestSchema>;

export const updateCronJobRequestSchema = z.object({
    schedule: z.string(),
    command: z.string(),
    description: z.string().optional(),
    name: z.string(),
    bash_script: z.string().optional(),
    is_active: z.boolean(),
    id: z.string().optional(),
});

export type UpdateCronJobRequest = z.infer<typeof updateCronJobRequestSchema>;

export const cronJobResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: cronJobSchema.optional(),
});

export type CronJobResponse = z.infer<typeof cronJobResponseSchema>;

export const cronJobListResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(cronJobSchema).optional(),
});

export type CronJobListResponse = z.infer<typeof cronJobListResponseSchema>;

export const yamlFields: (keyof CronJob)[] = ['name', 'description', 'schedule', 'command', 'bash_script', 'is_active'];

export interface CronTemplate {
    name: string;
    description?: string;
    schedule: string;
    command: string;
    bash_script?: string;
}

export const emptyJob: Partial<CronJob> = {
    name: '',
    description: '',
    schedule: '',
    command: '',
    bash_script: '',
    is_active: true,
    last_run_at: ""
};

export type CronJobFormValues = CreateCronJobRequest | UpdateCronJobRequest;

export interface CronExpressionInputProps {
    form: UseFormReturn<CronJobFormValues, any, undefined>;
}