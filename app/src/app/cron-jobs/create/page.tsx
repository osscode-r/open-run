"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import CronJobTemplates from '../components/CronJobTemplates';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CronJobData, JobStatus } from '../types';
import { CronJobForm } from '../components/CronJobForm';
import DashboardLayout from '@/app/home/page';

const emptyJob: Partial<CronJobData> = {
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

function CreateCronJob() {
    const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoadingTemplates(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (job: CronJobData) => {
        console.log('Submitting job:', job);
    };

    return (
        <DashboardLayout>
            <div className='mx-0'>
                <Card className='border-0 bg-inherit'>
                    <CardHeader>
                        <CardTitle>Create a New Cron Job</CardTitle>
                        <CardDescription>Select a template or create a custom cron job</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="template">
                            <TabsList className="grid w-fit grid-cols-2">
                                <TabsTrigger value="template">Use Template</TabsTrigger>
                                <TabsTrigger value="custom">Create Custom</TabsTrigger>
                            </TabsList>
                            <TabsContent value="template">
                                <CronJobTemplates isLoading={isLoadingTemplates} />
                            </TabsContent>
                            <TabsContent value="custom">
                                <CronJobForm initialJob={emptyJob} onSubmit={handleSubmit} isNewJob />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default CreateCronJob;