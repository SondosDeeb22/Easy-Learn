import { useState } from 'react';
import { queryClient } from '../../lib/react-query/queryClient';
// component 
import StudentsTable from '../components/StudentsTable';
import StudentFilter from '../components/FiltersPanel';
import StudentCard from '../components/StudentCard';

//hook
import { useStudents } from '../hooks/useStudents';
import { useStudentDetails } from '../hooks/useStudentDetails';

// interfaces
import { StudentFilterParams } from '../interfaces/users.interface';


// ====================================================================

export default function StudentsPage() {
    const rowsLimit = 5;
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<StudentFilterParams>({});

    const { data, isLoading, isError } = useStudents({ page, limit: rowsLimit, ...filters });
    const { data: studentData, loading: studentLoading, error: studentError } = useStudentDetails(filters.studentId || "");

    // when filters change, reset to page 1
    const handleApplyFilters = (newFilters: StudentFilterParams) => {
        setFilters(newFilters);
        setPage(1);
        queryClient.invalidateQueries({ queryKey: ['CurrentStudentCoursesForAdmin'] });

    };

    // ------------------------------------------------
    return (
        <div className="p-6">
            <h1 className="text-2xl mt-5 mb-10 font-bold text-gray-800">Student Management</h1>

            <StudentFilter onApply={handleApplyFilters} />

            {/* Show StudentCard only when a studentId filter is active --------------------  */}
            {filters.studentId && !studentLoading && (
                <StudentCard student={studentData!} />
            )}

            {(filters.courseId || filters.semesterId) && !isLoading && (
                <StudentsTable
                    students={data?.students ?? []}
                    loading={isLoading}
                    error={isError ? "Failed to load students" : undefined}
                    page={page}
                    limit={rowsLimit}
                    totalRows={data?.totalRows ?? 0}
                    setPage={setPage}
                />)}
        </div>
    )
}