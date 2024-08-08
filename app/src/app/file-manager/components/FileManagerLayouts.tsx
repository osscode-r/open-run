import React from 'react'
import {
    Grid,
    List,
} from 'lucide-react';
import { Button } from "@/components/ui/button"

interface FileManagerLayoutsProps {
    layout: 'grid' | 'list',
    setLayout: React.Dispatch<React.SetStateAction<'grid' | 'list'>>
}

function FileManagerLayouts({ layout, setLayout }: FileManagerLayoutsProps) {
    return (
        <div>
            <div>
                <Button
                    variant={layout === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setLayout('grid')}
                    className="mr-2"
                >
                    <Grid className="h-4 w-4" />
                </Button>
                <Button
                    variant={layout === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setLayout('list')}
                >
                    <List className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default FileManagerLayouts