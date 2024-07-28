import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { Command, CommandList, CommandGroup, CommandItem, CommandInput } from './command';
import { Input } from './input';
import { Button } from './button';
import { X } from 'lucide-react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { cn } from '@/lib/utils';

interface SelectableListProps {
    items: Array<{ id: string; title: string, thumbnail?: string }>;
    selectedItems: string[];
    onSave: (selectedItems: string[]) => void;
    searchQuery?: (query: string) => void;
    isLoading: boolean;
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
    suggestionVisible?: boolean,
    showSaveButton?: boolean,
    showThumbnail?: boolean,
    isSingleSelect?: boolean
}

const SelectableList: React.FC<SelectableListProps> = ({ items, selectedItems, onSave, searchQuery, isLoading, setSelectedItems, showSaveButton = true, showThumbnail = true, isSingleSelect = false }) => {
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 300);
    const [isCommandListOpen, setIsCommandListOpen] = useState(!searchQuery ? true : false);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setIsCommandListOpen(e.target.value.length > 0);
    }, []);

    useEffect(() => {
        if (searchQuery && debouncedSearch) {
            searchQuery(debouncedSearch);
        }
    }, [debouncedSearch, searchQuery]);

    const sortedItems = useMemo(() => {
        if (!items || !items.length) {
            return [];
        }
        const selectedSet = new Set(selectedItems);
        return [...items].sort((a, b) =>
            Number(selectedSet.has(b.title)) - Number(selectedSet.has(a.title))
        );
    }, [items, selectedItems]);

    const handleSelect = useCallback((title: string) => {
        setSelectedItems((prevSelectedItems) => {
            if (isSingleSelect) {
                return prevSelectedItems[0] === title ? [] : [title];
            } else {
                if (prevSelectedItems.includes(title)) {
                    return prevSelectedItems.filter(item => item !== title);
                } else {
                    return [...prevSelectedItems, title];
                }
            }
        });
    }, [isSingleSelect]);

    return (
        <div className="grid gap-4 py-4">
            <Command>
                <div className="flex flex-wrap gap-2">
                    {[...selectedItems].reverse().slice(0, 4).map((title) => (
                        <div
                            key={title}
                            className="flex items-center justify-between rounded-full bg-secondary p-2 text-xs font-medium"
                        >
                            <span className='truncate max-w-32'>{title}</span>
                            <X
                                className="ml-1 h-4 w-4 rounded-full hover:text-primary cursor-pointer"
                                onClick={() => handleSelect(title)}
                            />
                        </div>
                    ))}
                </div>
                {selectedItems.length > 4 && (
                    <div className='text-blue-600 mb-2'>... and {selectedItems.length - 4} more</div>
                )}
                {
                    !searchQuery ?
                        <div className='my-3'>
                            <CommandInput placeholder="Search an item" />
                        </div>
                        :
                        <Input
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search an item"
                            className='flex w-full my-3 border-0 border-b-2 rounded-none bg-transparent text-sm outline-none font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0'
                        />
                }
                {isCommandListOpen && <CommandList>
                    <CommandGroup heading="Suggestions">
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : sortedItems.length > 0 && (
                            sortedItems
                                .filter(({ title }) => title?.toLowerCase().includes(search?.toLowerCase()))
                                .map(({ id, title, thumbnail }) => (
                                    <CommandItem
                                        key={id}
                                        onSelect={() => handleSelect(title)}
                                        className={cn(selectedItems.includes(title) ? 'bg-secondary my-2' : '', 'py-2')}
                                    >
                                        <div className='flex items-center justify-start space-x-2'>
                                            {thumbnail && showThumbnail &&
                                                <Avatar>
                                                    <AvatarImage src={thumbnail} alt={title} className='object-cover' />
                                                    <AvatarFallback>{title[0]}</AvatarFallback>
                                                </Avatar>}
                                            <span>{title}</span>
                                        </div>
                                    </CommandItem>
                                ))
                        )}
                    </CommandGroup>
                </CommandList>}
            </Command>
            {showSaveButton && <div className="flex justify-end">
                <Button type="button" onClick={() => onSave(selectedItems)}>Save changes</Button>
            </div>}
        </div>
    );
};

export default SelectableList;
