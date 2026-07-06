import { useState } from 'react';
import { Button, ConfigProvider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// component 
import CoursesTable from './components/CoursesTable';
import CoursesFilterPanel from './components/CoursesFilterPanel';
import AddCourseModal from './components/AddCourseModal';

// generic componenets
import Loading from '../../shared/components/Loading';
import ErrorState from "../../shared/components/ErrorState";


//hook
import { useCourses } from './hooks/useCourses';

// interfaces
import { CourseFilterParams } from './courses.interface';
import { colors } from '../../styles/colorPalette';
const PAGE_LIMIT = 5;
// ====================================================================

const CoursesPage: React.FC = () => {
    const [filters, setFilters] = useState<CourseFilterParams>({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [page, setPage] = useState(1);

    const { data, isLoading: coursesLoading, error: coursesError } = useCourses(filters, page, PAGE_LIMIT);

    console.log(`[CoursesPage] filters: ${JSON.stringify(filters)}`)
    console.log(`[CoursesPage] total courses: ${data?.totalRows}\ncourses: ${JSON.stringify(data?.courses)}\n data: ${JSON.stringify(data)}`);

    const handleApplyFilters = (newFilters: CourseFilterParams) => {
        setFilters(newFilters);
    };

    if (coursesLoading) return (
        <Loading />
    );

    if (coursesError) return (
        <ErrorState />
    )

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
                    loading={coursesLoading}
                    error={coursesError ? "Failed to Load Courses" : undefined}
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

export default CoursesPage;
