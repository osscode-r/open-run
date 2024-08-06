import React from 'react';
import CronJobCard from './CronJobCard';
import { CronJob } from '../types';
import CronJobCardSkeleton from './cron-job-card-skeleton';

interface CronJobProps {
    jobs: CronJob[];
    onEditCronJob: (id: string) => void;
    isLoading: boolean;
}

function CronJobList({ jobs, onEditCronJob, isLoading }: CronJobProps) {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8'>
            {jobs.map((job, index) => (
                <CronJobCard key={index} job={job} isLoading={isLoading} onEditCronJob={onEditCronJob} />
            ))}
            {jobs.length === 0 && (
                Array(9).fill(0).map((_, index) => (
                    <CronJobCardSkeleton key={index} />
                ))
            )}
        </div>
    );
}

export default CronJobList;