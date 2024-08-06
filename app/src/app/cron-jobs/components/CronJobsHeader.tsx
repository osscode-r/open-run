import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { CronJob } from '../types';
import { SearchBar } from './SearchBar';
import { SortOption, SortSelect } from './SortSelect';

interface CronJobsHeaderProps {
    searchTerm: string;
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sortConfig: { key: keyof CronJob; direction: 'asc' | 'desc' };
    handleSortChange: (newSort: SortOption<CronJob>) => void;
    onCreateClick: () => void;
}

const sortOptions: SortOption<CronJob>[] = [
    { value: 'name', label: 'Name (A-Z)', direction: 'asc' },
    { value: 'name', label: 'Name (Z-A)', direction: 'desc' },
    { value: 'is_active', label: 'Status (A-Z)', direction: 'asc' },
    { value: 'is_active', label: 'Status (Z-A)', direction: 'desc' },
];

function CronJobsHeader({ 
    searchTerm, 
    handleSearchChange, 
    sortConfig,
    handleSortChange, 
    onCreateClick 
}: CronJobsHeaderProps) {
    return (
        <div className='flex justify-between items-center'>
            <div className='flex items-center my-10 space-x-4'>
                <h1 className='text-3xl font-bold'>Cron Jobs</h1>
                <SearchBar 
                    searchTerm={searchTerm} 
                    handleSearchChange={handleSearchChange}
                    label="Search jobs..."
                />
                <SortSelect<CronJob>
                    options={sortOptions}
                    currentSort={{
                        value: sortConfig.key,
                        direction: sortConfig.direction,
                        label: sortOptions.find(option => 
                            option.value === sortConfig.key && 
                            option.direction === sortConfig.direction
                        )?.label || ''
                    }}
                    onSortChange={handleSortChange}
                    placeholder="Sort by"
                />
            </div>
            <Button variant={'outline'} onClick={onCreateClick}>
                Create <PlusIcon className='ml-2 h-4 w-4' />
            </Button>
        </div>
    );
}

export default CronJobsHeader;