import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CronJob } from '../types';

interface CronJobsHeaderProps {
    searchTerm: string;
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSortChange: (value: keyof CronJob) => void;
    onCreateClick: () => void;
}

function CronJobsHeader({ searchTerm, handleSearchChange, handleSortChange, onCreateClick }: CronJobsHeaderProps) {
    return (
        <div className='flex justify-between items-center'>
            <div className='flex items-center my-10 space-x-4'>
                <h1 className='text-3xl font-bold'>Cron Jobs</h1>
                <div className="relative">
                    <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pl-8 w-64"
                    />
                </div>
                <Select
                    onValueChange={(value) => handleSortChange(value.split('_')[0] as keyof CronJob)}
                    defaultValue="name_asc"
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                        <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                        <SelectItem value="tag_asc">Status (A-Z)</SelectItem>
                        <SelectItem value="tag_desc">Status (Z-A)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button variant={'outline'} onClick={onCreateClick}>
                Create <PlusIcon className='ml-2 h-4 w-4' />
            </Button>
        </div>
    );
}

export default CronJobsHeader;