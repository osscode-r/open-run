import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CronJobTemplatesSkeleton from './cron-job-templates-skeleton';

const templates = [
    {
        id: 'daily-backup',
        name: 'Daily Backup',
        description: 'Perform a daily backup at midnight',
        schedule: '0 0 * * *',
        command: 'backup.sh',
    },
    {
        id: 'weekly-report',
        name: 'Weekly Report',
        description: 'Generate a weekly report every Monday at 8 AM',
        schedule: '0 8 * * 1',
        command: 'generate_report.sh',
    },
    {
        id: 'monthly-report',
        name: 'Monthly Report',
        description: 'Generate a monthly report every first day of the month at 8 AM',
        schedule: '0 8 1 * *',
        command: 'generate_report.sh',
    },
    {
        id: 'yearly-report',
        name: 'Yearly Report',
        description: 'Generate a yearly report every first day of the year at 8 AM',
        schedule: '0 8 1 1 *',
        command: 'generate_report.sh',
    },
];

interface CronJobTemplatesProps {
    isLoading?: boolean;
}

function CronJobTemplates({ isLoading = false }: CronJobTemplatesProps) {
    const router = useRouter();

    const handleSelectTemplate = (templateId: string) => {
        router.push(`/cron-jobs/edit?template=${templateId}`);
    };

    if (isLoading) {
        return <CronJobTemplatesSkeleton />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-8">
            {templates.map((template) => (
                <Card
                    key={template.id}
                    className='hover:cursor-pointer transition-colors duration-200'
                >
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>{template.name}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className='text-sm text-muted-foreground truncate'>{template.description}</p>
                            <p className='text-sm text-muted-foreground'>Schedule: {template.schedule}</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant='outline'
                            onClick={() => handleSelectTemplate(template.id)}
                        >
                            Use Template
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

export default CronJobTemplates;