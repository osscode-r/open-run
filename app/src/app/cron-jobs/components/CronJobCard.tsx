import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CronJob, JobStatus } from '../page';

export type CronJobProps = {
    job: CronJob;
    JobStatus: typeof JobStatus;
    onEditCronJob: (id: string) => void;
};

function CronJobCard({ job, JobStatus, onEditCronJob }: CronJobProps) {
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
                        Last run: {new Date(job.lastRun).toLocaleString()}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        Next run: {new Date(job.nextRun).toLocaleString()}
                    </p>
                    <Badge variant={job.isActive ? "default" : "secondary"}>
                        {job.isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}

export default CronJobCard;