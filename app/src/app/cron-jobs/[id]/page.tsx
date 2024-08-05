"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreateCronJobRequest, UpdateCronJobRequest } from '../types';
import { CronJobForm } from '../components/CronJobForm';
import DashboardLayout from '@/app/home/page';
import { useGetCronJobByIdQuery } from '@/redux/services/cronJobsApi';

function CronJob() {
    const router = useRouter();
    const cronJobId = useParams<{ id: string }>().id;
    const { data: cronJob, isLoading } = useGetCronJobByIdQuery(cronJobId);
    const onSubmit = (data: CreateCronJobRequest | UpdateCronJobRequest) => {
        console.log('Saving job data:', data);
        router.push('/cron-jobs');
    };

    const isNewJob = !cronJob?.id;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <DashboardLayout>
            <CronJobForm initialJob={cronJob} onSubmit={onSubmit} isNewJob={isNewJob} />
        </DashboardLayout>
    );
}

export default CronJob;