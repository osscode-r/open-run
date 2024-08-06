import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CronTemplate } from '../types';

interface TemplateGridProps {
    templates: CronTemplate[];
    handleSelectTemplate: (templateName: string) => void;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({ templates, handleSelectTemplate }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-12 mt-8">
        {templates.map((template) => (
            <Card className='hover:cursor-pointer transition-colors duration-200' key={template.name}>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>{template.name}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p className='text-sm text-muted-foreground truncate'>{template.description}</p>
                        <p className='text-sm text-muted-foreground'>Schedule: {template.schedule}</p>
                        <p className='text-sm text-muted-foreground truncate'>Command: {template.command}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        variant={'outline'}
                        onClick={() => handleSelectTemplate(template.name)}
                    >
                        Use Template
                    </Button>
                </CardFooter>
            </Card>
        ))}
    </div>
);