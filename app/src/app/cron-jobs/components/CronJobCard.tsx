import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CronJob, JobStatus } from '../page';
import CronJobCardSkeleton from './cron-job-card-skeleton';

export type CronJobProps = {
    job?: CronJob;
    JobStatus: typeof JobStatus;
    onEditCronJob: (id: string) => void;
    isLoading?: boolean;
};

function CronJobCard({ job, JobStatus, onEditCronJob, isLoading = false }: CronJobProps) {
    if (isLoading || !job) {
        return <CronJobCardSkeleton />;
    }

    return (
        <Card
            className='hover:bg-muted hover:cursor-pointer transition-colors duration-200'
            onClick={() => onEditCronJob(job.id)}
        >
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{job.name}</span>
                    <Badge
                        className={job.tag === JobStatus.RUNNING ? 'bg-green-500' : 'bg-red-500'}
                    >
                        {job.tag}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className='text-sm text-muted-foreground truncate'>{job.description}</p>
                    <p className='text-sm text-muted-foreground'>Schedule: {job.schedule}</p>
                    <p className='text-sm text-muted-foreground'>
                        Last run: {new Date(job.last_run).toLocaleString()}
                    </p>
                    <Badge variant={job.is_active ? "default" : "secondary"}>
                        {job.is_active ? "Active" : "Inactive"}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}

export default CronJobCard;