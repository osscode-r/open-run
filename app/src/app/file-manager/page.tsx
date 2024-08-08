"use client";
import React, { useState, useEffect } from "react";
import { useGetFilesInPathQuery } from "@/redux/services/fileManagersApi";
import { FileData } from "./types";
import { FileItem } from "./components/FileItem";
import { FileBreadCrumbs } from "./components/FileBreadCrumbs";
import FileManagerActions from "./components/FileManagerActions";
import FileManagerHeader from "./components/FileManagerHeader";
import FileManagerLayouts from "./components/FileManagerLayouts";
import { Loader2 } from "lucide-react";
import DashboardLayout from "../home/page";
import { useRef } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "../cron-jobs/components/SearchBar";
import { useSortableSearchableData } from "../cron-jobs/hooks/useSortableSearchData";

function FileManager() {
    const [currentPath, setCurrentPath] = useState("/");
    const [breadcrumbs, setBreadCrumbPath] = useState<string[]>([]);
    const [selectedPath, setSelectedPath] = useState<string>("");
    const [layout, setLayout] = useState<"grid" | "list">("grid");
    const {
        data: files,
        isLoading,
        error,
        refetch,
    } = useGetFilesInPathQuery({ path: currentPath });
    const constraintsRef = useRef<null | HTMLDivElement>(null);
    const {
        filteredAndSortedData,
        searchTerm,
        handleSearchChange,
        handleSortChange,
        sortConfig,
    } = useSortableSearchableData<FileData>(
        files || [],
        ["name", "path", "file_type"],
        { key: "name", direction: "asc" }
    );
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setBreadCrumbPath(currentPath.split("/").filter(Boolean));
        refetch();
    }, [currentPath, refetch]);

    function fileClicked(filePath: string) {
        setCurrentPath(filePath);
    }

    function onFolderClickActive(path: string) {
        setSelectedPath(path);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                constraintsRef.current &&
                !constraintsRef.current.contains(event.target as Node)
            ) {
                setSelectedPath("");
            }
        };

        document.addEventListener("click", handleClickOutside, true);

        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    return (
        <DashboardLayout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between">
                    <FileManagerHeader />
                    <div className="relative">
                        <SearchBar
                            searchTerm={searchTerm}
                            handleSearchChange={handleSearchChange}
                            label="Search files..."
                        />
                    </div>
                </div>
                <div className="my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <FileBreadCrumbs
                        breadcrumbs={breadcrumbs}
                        fileClicked={fileClicked}
                    />
                    <div className="flex items-center gap-4">
                        <FileManagerLayouts layout={layout} setLayout={setLayout} />
                        <FileManagerActions refetch={refetch} />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-8">
                        Error loading files. Please try again.
                    </div>
                ) : (
                    <div>
                        <motion.div
                            className={`
                    ${layout === "grid"
                                    ? "flex flex-wrap gap-x-2"
                                    : "flex flex-col gap-2"
                                }
                `}
                            ref={constraintsRef}
                        >
                            {(files || [])
                                .filter((file: FileData) => file.is_hidden === false)
                                .map((file: FileData) => (
                                    <motion.div
                                        drag
                                        dragConstraints={constraintsRef}
                                        key={file.path}
                                    >
                                        <FileItem
                                            fileName={file.name}
                                            filePath={file.path}
                                            onFolderClick={fileClicked}
                                            key={file.path}
                                            type={file.file_type === "Directory" ? "folder" : "file"}
                                            layout={layout}
                                            activePath={selectedPath}
                                            onFolderClickActive={onFolderClickActive}
                                        />
                                    </motion.div>
                                ))}
                        </motion.div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default FileManager;
