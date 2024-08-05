import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CronJob } from '../types';

export type CronJobProps = {
    job: CronJob;
    onEditCronJob: (id: string) => void;
};

function CronJobCard({ job, onEditCronJob }: CronJobProps) {
    return (
        <Card
            className='hover:bg-muted hover:cursor-pointer transition-colors duration-200'
            onClick={() => onEditCronJob(job.id)}
        >
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{job.name}</span>
                    <Badge
                        className={job.is_active ? 'bg-green-500' : 'bg-red-500'}
                    >
                        {job.is_active ? 'Running' : 'Stopped'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className='text-sm text-muted-foreground truncate'>{job.description}</p>
                    <p className='text-sm text-muted-foreground'>Schedule: {job.schedule}</p>
                    <p className='text-sm text-muted-foreground'>
                        Last run: {isNaN(Date.parse(job.last_run_at || "")) ? 'Not run yet' : new Date(job.last_run_at || "").toLocaleString()}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default CronJobCard;