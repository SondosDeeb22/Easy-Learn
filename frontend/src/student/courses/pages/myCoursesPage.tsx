import { useState } from 'react';
//component
import StudnetCoursesTable from '../components/StudnetCoursesTable';
// generic componenets
import Loading from '../../../shared/components/Loading';
import ErrorState from "../../../shared/components/ErrorState";

//hook
import { useAllStudentCourses } from '../hooks/useAllStudnetCourses';

const PAGE_LIMIT = 8;
// ====================================================================
export default function MyCoursesPage() {


    const [page, setPage] = useState(1); // page 1 as defualt

    const { data, isLoading, isError } = useAllStudentCourses(page, PAGE_LIMIT);

    // show loading
    if (isLoading) return (
        <Loading />
    );

    // show error if any
    if (isError) return (
        <ErrorState message="Failed to Load Courses" />
    );

    // =====================================================================
    return (
        <div className="p-6">
            <h1 className="text-2xl mt-5 mb-10 font-bold text-gray-800">My Courses</h1>
            <StudnetCoursesTable
                allCourses={data?.courses ?? []}
                loading={isLoading}
                error={isError ? "Failed to Load Courses" : undefined}
                page={page}
                limit={PAGE_LIMIT}
                totalRows={data?.totalRows ?? 0}
                setPage={setPage}
            />
        </div>
    );
}