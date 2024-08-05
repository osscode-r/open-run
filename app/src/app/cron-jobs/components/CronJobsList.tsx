import React from 'react';
import CronJobCard from './CronJobCard';
import { CronJob, JobStatus } from '../types';

interface CronJobProps {
    jobs: CronJob[];
    onEditCronJob: (id: string) => void;
}

function CronJobList({ jobs, onEditCronJob }: CronJobProps) {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
            {jobs.map((job, index) => (
                <CronJobCard key={index} job={job} onEditCronJob={onEditCronJob} />
            ))}
        </div>
    );
}

export default CronJobList;