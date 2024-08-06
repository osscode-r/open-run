import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
    searchTerm: string;
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, handleSearchChange, label = 'Search...' }) => (
    <div className="relative w-full sm:w-64">
        <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
            type="text"
            placeholder={label}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8 w-full sm:w-64"
        />
    </div>
);