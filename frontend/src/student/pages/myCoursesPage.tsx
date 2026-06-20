import { useState } from 'react';
//component
import StudnetCoursesTable from '../components/StudnetCoursesTable';

//hook
import { useAllStudentCourses } from '../hooks/useAllStudnetCourses';
import { useQueryClient } from '@tanstack/react-query';
// ====================================================================
export default function MyCoursesPage() {
    const rowsLimit = 8;

    const [page, setPage] = useState(1); // page 1 as defualt

    const { data, isLoading, isError } = useAllStudentCourses(page, rowsLimit);


    return (
        <div className="p-6">
            <h1 className="text-2xl mt-5 mb-10 font-bold text-gray-800">My Courses</h1>
            <StudnetCoursesTable
                allCourses={data?.courses ?? []}
                loading={isLoading}
                error={isError ? "Failed to Load Courses" : undefined}
                page={page}
                limit={rowsLimit}
                totalRows={data?.totalRows ?? 0}
                setPage={setPage}
            />
        </div>
    );
}