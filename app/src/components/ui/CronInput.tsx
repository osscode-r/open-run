import { CronExpressionInputProps, } from '../../app/cron-jobs/types';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { parseExpression } from 'cron-parser';
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";

export const CronExpressionInput: React.FC<CronExpressionInputProps> = ({ form }) => {
    const [cronDescription, setCronDescription] = useState<string>('');
    const [internalCronParts, setInternalCronParts] = useState({
        minute: '*',
        hour: '*',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '*'
    });

    const cronFields = [
        { name: 'minute', label: 'Minute', placeholder: '*', max: 59, maxLength: 2 },
        { name: 'hour', label: 'Hour', placeholder: '*', max: 23, maxLength: 2 },
        { name: 'dayOfMonth', label: 'Day of Month', placeholder: '*', max: 31, min: 1, maxLength: 2 },
        { name: 'month', label: 'Month', placeholder: '*', max: 12, min: 1, maxLength: 2 },
        { name: 'dayOfWeek', label: 'Day of Week', placeholder: '*', max: 6, maxLength: 1 },
    ];

    const validateCronExpression = (cronExpression: string): boolean => {
        try {
            const interval = parseExpression(cronExpression);
            const nextDate = interval.next().toString();
            setCronDescription(`Next execution: ${nextDate}`);
            return true;
        } catch (error) {
            setCronDescription('Invalid cron expression');
            return false;
        }
    };

    const updateSchedule = (parts: typeof internalCronParts) => {
        const cronExpression = Object.values(parts).join(' ');
        form.setValue('schedule', cronExpression, { shouldValidate: true });
        validateCronExpression(cronExpression);
    };

    useEffect(() => {
        const schedule = form.getValues('schedule');
        if (schedule) {
            const parts = schedule.split(' ');
            const newCronParts = {
                minute: parts[0] || '*',
                hour: parts[1] || '*',
                dayOfMonth: parts[2] || '*',
                month: parts[3] || '*',
                dayOfWeek: parts[4] || '*'
            };
            setInternalCronParts(newCronParts);
            validateCronExpression(schedule);
        }
    }, [form]);

    const validateInput = (value: string, max: number, min: number = 0): string => {
        if (value === '*' || value === '') return value;
        const num = parseInt(value);
        if (isNaN(num) || num < min || num > max) return '';
        return num.toString();
    };

    const handleCronPartChange = (name: string, value: string) => {
        const field = cronFields.find(f => f.name === name);
        if (field) {
            if (!/^(\d+|\*)?$/.test(value)) {
                return;
            }

            if (value !== '*' && value !== '') {
                const num = parseInt(value);
                if (num > field.max) {
                    return;
                }
            }

            setInternalCronParts(prev => ({ ...prev, [name]: value }));

            const validatedValue = validateInput(value, field.max, field.min);
            if (validatedValue !== '' || value === '' || value === '*') {
                updateSchedule({ ...internalCronParts, [name]: validatedValue || '*' });
            }
        }
    };

    const handleCronPartBlur = (name: string, value: string) => {
        const field = cronFields.find(f => f.name === name);
        if (field) {
            const validatedValue = validateInput(value, field.max, field.min);
            const newValue = validatedValue || '*';
            setInternalCronParts(prev => ({ ...prev, [name]: newValue }));
            updateSchedule({ ...internalCronParts, [name]: newValue });
        }
    };

    return (
        <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Schedule (Cron Expression)</FormLabel>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                        {cronFields.map((cronField) => (
                            <FormItem key={cronField.name}>
                                <FormLabel className="text-xs">{cronField.label}</FormLabel>
                                <FormControl>
                                    <Input
                                        value={internalCronParts[cronField.name as keyof typeof internalCronParts]}
                                        onChange={(e) => handleCronPartChange(cronField.name, e.target.value)}
                                        onBlur={(e) => handleCronPartBlur(cronField.name, e.target.value)}
                                        placeholder={cronField.placeholder}
                                        maxLength={cronField.maxLength}
                                    />
                                </FormControl>
                            </FormItem>
                        ))}
                    </div>
                    <FormControl>
                        <Input {...field} disabled className="mt-2" readOnly />
                    </FormControl>
                    <FormDescription>
                        {cronDescription || 'Enter a valid cron expression'}
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};