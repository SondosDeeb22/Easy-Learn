import { useState } from 'react';
import { queryClient } from '../../lib/react-query/queryClient';
// component 
import StudentsTable from './components/StudentsTable';
import StudentFilter from './components/StudentsFiltersPanel';
import StudentCard from './components/StudentCard';

// generic componenets
import Loading from '../../shared/components/Loading';
import ErrorState from "../../shared/components/ErrorState";

//hook
import { useStudents } from './hooks/useStudents';
import { useStudentDetails } from './hooks/useStudentDetails';

// interfaces
import { StudentFilterParams } from './users.interface';


// ====================================================================

export default function StudentsPage() {
    const PAGE_LIMIT = 5;
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<StudentFilterParams>({});

    const { data: studentsData, isLoading: studentsLoading, error: studentsError } = useStudents({ page, limit: PAGE_LIMIT, ...filters });
    const { data: studentData, isLoading: studentLoading, error: studentError } = useStudentDetails(filters.studentId || "");

    // when filters change, reset to page 1
    const handleApplyFilters = (newFilters: StudentFilterParams) => {
        setFilters(newFilters);
        setPage(1);
        queryClient.invalidateQueries({ queryKey: ['CurrentStudentCoursesForAdmin'] });

    };

    if (studentsLoading || studentLoading) return (
        <Loading />
    );

    if (studentsError || studentError) return (
        <ErrorState />
    );

    // ------------------------------------------------
    return (
        <div className="p-6">
            <h1 className="text-2xl mt-5 mb-10 font-bold text-gray-800">Student Management</h1>

            <StudentFilter onApply={handleApplyFilters} />

            {/* Show StudentCard only when a studentId filter is active --------------------  */}
            {filters.studentId && !studentLoading && (
                <StudentCard student={studentData!} />
            )}

            {(filters.courseId || filters.semesterId || filters.status) && !studentsLoading && (
                <StudentsTable
                    students={studentsData?.students ?? []}
                    loading={studentsLoading}
                    error={studentsError ? "Failed to load students" : undefined}
                    page={page}
                    limit={PAGE_LIMIT}
                    totalRows={studentsData?.totalRows ?? 0}
                    setPage={setPage}
                />)}
        </div>
    )
}