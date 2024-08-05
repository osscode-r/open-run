import { CronJob, yamlFields } from '../types';

export function filterJobDataForYaml(jobData: any): Partial<CronJob> {
    return yamlFields.reduce((acc: any, field: string) => {
        if (field in jobData && jobData[field] !== undefined) {
            (acc as any)[field] = jobData[field];
        }
        return acc;
    }, {} as Partial<CronJob>);
}