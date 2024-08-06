"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import CronJobTemplates from '../components/CronJobTemplates';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { emptyJob } from '../types';
import { CronJobForm } from '../components/CronJobForm';
import DashboardLayout from '@/app/home/page';
import { useGetAllCronJobsQuery, useCreateCronJobMutation } from '@/redux/services/cronJobsApi';
import { CreateCronJobRequest, UpdateCronJobRequest } from '../types';
import { useRouter } from 'next/navigation';

function CreateCronJob() {
    const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoadingTemplates(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const [createCronJob, { isLoading: isCreating }] = useCreateCronJobMutation();
    const { data: allJobs, isLoading: isLoadingJobs, refetch: refetchJobs } = useGetAllCronJobsQuery({});
    const router = useRouter();

    const onSubmit = async (data: CreateCronJobRequest | UpdateCronJobRequest) => {
        console.log('Saving job data:', data);
        try {
            const newJobData: CreateCronJobRequest = {
                ...data,
            };
            await createCronJob(newJobData).unwrap();
            refetchJobs();
            router.push('/cron-jobs');
        } catch (error) {
            console.error('Error saving job:', error);
        }
    };

    return (
        <DashboardLayout>
            <div className='mx-0'>
                <div className='border-0 bg-inherit space-y-4'>
                    <div className='w-full'>
                        <h1 className='text-xl lg:text-3xl font-bold'>Create a New Cron Job</h1>
                        <p className='text-sm text-muted-foreground'>Select a template or create a custom cron job</p>
                    </div>
                    <div className='w-full'>
                        <Tabs defaultValue="template">
                            <TabsList className="grid w-fit grid-cols-2">
                                <TabsTrigger value="template">Use Template</TabsTrigger>
                                <TabsTrigger value="custom">Create Custom</TabsTrigger>
                            </TabsList>
                            <TabsContent value="template">
                                <CronJobTemplates isLoading={isLoadingTemplates} />
                            </TabsContent>
                            <TabsContent value="custom">
                                <CronJobForm initialJob={emptyJob} onSubmit={onSubmit} isNewJob />
                            </TabsContent >
                        </Tabs >
                    </div >
                </div >
            </div >
        </DashboardLayout >
    );
}

export default CreateCronJob;