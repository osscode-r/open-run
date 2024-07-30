import { z } from 'zod';

export enum JobStatus {
    RUNNING = 'Running',
    STOPPED = 'Stopped',
    FAILED = 'Failed',
}

export const cronJobSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Name is required"),
    description: z.string(),
    schedule: z.string().regex(/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])\s*)((\*|(?:[0-9]|1[0-9]|2[0-3]))\s*)((\*|(?:[1-9]|1[0-9]|2[0-9]|3[0-1]))\s*)((\*|(?:[1-9]|1[0-2]))\s*)((\*|(?:[0-6]))\s*)$/, "Invalid cron schedule"),
    command: z.string().min(1, "Command is required"),
    bashScript: z.string().optional(),
    isActive: z.boolean(),
    lastRun: z.string(),
    nextRun: z.string(),
    status: z.nativeEnum(JobStatus),
});

export type CronJobData = z.infer<typeof cronJobSchema>;

export const yamlFields: (keyof CronJobData)[] = ['name', 'description', 'schedule', 'command', 'bashScript', 'isActive'];