import { useState } from 'react';
import { Button, ConfigProvider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// component 
import CoursesTable from '../components/CoursesTable';
import CoursesFilterPanel from '../components/CoursesFilterPanel';
import AddCourseModal from '../components/AddCourseModal';

//hook
import { useCourses } from '../hooks/useCourses';

// interfaces
import { CourseFilterParams } from '../interfaces/courses.interface';
import { colors } from '../../styles/colorPalette';

// ====================================================================

export default function CoursesPage() {
    const [filters, setFilters] = useState<CourseFilterParams>({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [page, setPage] = useState(1);
    const PAGE_LIMIT = 5;
    const { data, isLoading, isError } = useCourses(filters, page, PAGE_LIMIT);

    console.log(`[CoursesPage] total courses: ${data?.totalRows}\ncourses: ${JSON.stringify(data?.courses)}\n data: ${JSON.stringify(data)}`);

    const handleApplyFilters = (newFilters: CourseFilterParams) => {
        setFilters(newFilters);
    };

    // ------------------------------------------------
    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy } }}>
            <div className="p-6">
                <div className="flex justify-between items-center mt-5 mb-10">
                    <h1 className="text-2xl font-bold text-gray-800 m-0">Courses Management</h1>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddModalOpen(true)}
                        size="large"
                    >
                        Add Course
                    </Button>
                </div>

                {/* Filter  --------------------------------------*/}
                <CoursesFilterPanel onApply={handleApplyFilters} />

                {/* Table --------------------------------------------*/}
                <CoursesTable
                    courses={data?.courses ?? []}
                    loading={isLoading}
                    error={isError ? "Failed to load courses" : undefined}
                    page={page}
                    limit={PAGE_LIMIT}
                    totalRows={data?.totalRows ?? 0}
                    setPage={setPage}

                />

                {/* Add Modal -------------------------------------------*/}
                <AddCourseModal
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                />
            </div>
        </ConfigProvider>
    )
}
