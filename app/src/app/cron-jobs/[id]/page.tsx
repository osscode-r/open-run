"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CronJobData, JobStatus } from '../types';
import { ArrowLeft } from 'lucide-react';
import { CronJobForm } from '../components/CronJobForm';

interface CronJobProps {
    initialJob?: Partial<CronJobData>;
}

const defaultCronJob: CronJobData = {
    id: '',
    name: '',
    description: '',
    schedule: '',
    command: '',
    bashScript: '',
    isActive: true,
    lastRun: new Date().toISOString(),
    nextRun: new Date().toISOString(),
    status: JobStatus.STOPPED,
};

function CronJob({ initialJob = {} }: CronJobProps) {
    const router = useRouter();
    const combinedInitialJob = { ...defaultCronJob, ...initialJob };

    const onSubmit = (data: CronJobData) => {
        console.log('Saving job data:', data);
        router.push('/cron-jobs');
    };

    const isNewJob = !initialJob.id;

    return (
        <div className='container py-10'>
            <Button
                variant='outline'
                onClick={() => router.back()}
                className='mt-6 mb-10'
            >
                <span className='sr-only'>Back</span>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back
            </Button>
            <CronJobForm initialJob={combinedInitialJob} onSubmit={onSubmit} isNewJob={isNewJob} />
        </div>
    );
}

export default CronJob;