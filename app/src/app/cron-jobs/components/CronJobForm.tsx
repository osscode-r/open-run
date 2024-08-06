import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import yaml from 'js-yaml';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AceEditorComponent } from '../../../components/ui/CodeEditor';
import { CronJobData, cronJobSchema, JobStatus } from '../types';
import { filterJobDataForYaml } from '../hooks/filter-cron-job-fields';
import { useNavigation } from '@/lib/hook/use-navigation-hook';
import { CronJob, CreateCronJobRequest, UpdateCronJobRequest, createCronJobRequestSchema, updateCronJobRequestSchema } from '../types';

interface CronJobFormProps {
    initialJob: Partial<CronJob | CreateCronJobRequest>;
    onSubmit: (data: CreateCronJobRequest | UpdateCronJobRequest) => void;
    isNewJob: boolean;
}

export function CronJobForm({ initialJob, onSubmit, isNewJob }: CronJobFormProps) {
    const [yamlView, setYamlView] = useState(false);
    const [yamlContent, setYamlContent] = useState('');
    const [yamlError, setYamlError] = useState('');
    const { goBack } = useNavigation();

    const form = useForm < CreateCronJobRequest | UpdateCronJobRequest > ({
        resolver: zodResolver(isNewJob ? createCronJobRequestSchema : updateCronJobRequestSchema),
        defaultValues: initialJob,
    });

    const watchedData = form.watch();

    useEffect(() => {
        setYamlContent(yaml.dump(watchedData));
    }, [watchedData]);

    const handleYamlChange = (newValue: string) => {
        setYamlContent(newValue);
        try {
            const parsed = yaml.load(newValue) as Partial<CreateCronJobRequest | UpdateCronJobRequest>;
            Object.entries(parsed).forEach(([key, value]) => {
                form.setValue(key as any, value as any);
            });
            setYamlError('');
        } catch (e) {
            setYamlError('Invalid YAML: ' + JSON.stringify(e, null, 4));
        }
    };

    const handleSubmit = async (data: CronJobData) => {
        await onSubmit(data);
        goBack();
    };


    return (
        <Form {...form}>
            <div className="mb-4 justify-between flex">
                <h1 className='text-3xl font-bold mb-6 mt-2'>
                    {isNewJob ? 'Create New Cron Job' : `Edit Cron Job: ${initialJob.name}`}
                </h1>
                <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button variant={'secondary'} size={'lg'} onClick={() => setYamlView(!yamlView)} className='w-full sm:w-auto'>
                        {yamlView ? 'Normal View' : 'Developer View'}
                    </Button>
                    <Button size={'lg'} onClick={form.handleSubmit(onSubmit)}>
                        {isNewJob ? 'Create' : 'Save'}
                    </Button>
                </div>
            </div >
            {
                yamlView ? (
                    <div className='space-y-4' >
                        <AceEditorComponent
                            mode="yaml"
                            onChange={handleYamlChange}
                            value={yamlContent}
                            name="yaml-editor"
                        />
                        {yamlError && <pre className="text-destructive whitespace-pre-wrap text-sm">{yamlError}</pre>
                        }
                    </div >
                ) : (
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="w-full pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-muted rounded-lg shadow-sm p-4 space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold sm:text-lg w-full">Active</FormLabel>
                                                <br />
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="bg-muted rounded-lg shadow-sm p-4 space-y-2">
                                    <FormLabel className="text-base font-semibold sm:text-lg">Status</FormLabel>
                                    <p className="text-md font-semibold">{form.watch('status')}</p>
                                </div>

                                <div className="bg-muted rounded-lg shadow-sm p-4 space-y-2">
                                    <FormLabel className="text-base font-semibold sm:text-lg">Last Run</FormLabel>
                                    <p className="text-md font-semibold">{new Date(form.watch('lastRun')).toLocaleString()}</p>
                                </div>

                                <div className="bg-muted rounded-lg shadow-sm p-4 space-y-2">
                                    <FormLabel className="text-base font-semibold sm:text-lg">Next Run</FormLabel>
                                    <p className="text-md font-semibold">{new Date(form.watch('nextRun')).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="col-span-1 space-y-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="schedule"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Schedule (Cron Expression)</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {!isNewJob && (
                                    <FormField
                                        control={form.control}
                                        name="is_active"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Active</FormLabel>
                                                    <FormDescription>
                                                        Toggle to activate or deactivate the cron job
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {!isNewJob && 'last_run_at' in initialJob && (
                                    <div className='col-span-2 grid grid-cols-1 lg:grid-cols-2 space-y-5'>
                                        <div className='mt-5'>
                                            <FormLabel>Last Run</FormLabel>
                                            <p>{new Date(initialJob.last_run_at as string).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div >
                            <div className="col-span-1 space-y-5">
                                <FormField
                                    control={form.control}
                                    name="bash_script"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bash Script</FormLabel>
                                            <FormControl>
                                                <AceEditorComponent
                                                    mode="sh"
                                                    onChange={field.onChange}
                                                    value={field.value || ''}
                                                    name="bash-editor"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="command"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Run Command</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <div className="tracking-tight text-white font-mono bg-secondary p-2 sm:p-4 rounded text-xs sm:text-sm text-left space-y-1 w-full overflow-x-auto">
                                                        <div className="select-none text-neutral-400 font-bold pr-2 pb-4">
                                                            # The self-hosted version is ready on your server in under a minute.
                                                        </div>
                                                        <div>
                                                            <span className="select-none text-neutral-500 font-extrabold pr-2">&gt;</span>
                                                            <span className="break-all">curl -fsSL https://cdn.coollabs.io/install.sh | bash</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div >
                    </form >
                )}
        </Form >
    );
}