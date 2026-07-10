import React, { useEffect, useState } from 'react';
import { Button, ConfigProvider, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// hooks
import { useAdminOfferedCourses } from '../offeredCourses/hooks/offeredCourses.hook';
import { useCurrentSemester } from '../semesters/semesters.hook';
// components
import OfferedCoursesFilterPanel from '../offeredCourses/components/OfferedCoursesFilterPanel';
import OfferedCoursesTable from '../offeredCourses/components/OfferedCoursesTable';
import AddOfferedCourseModal from '../offeredCourses/components/AddOfferedCourseModal';

// generic componenets
import Loading from '../../shared/components/Loading';
import ErrorState from "../../shared/components/ErrorState";


// styles
import { colors } from '../../styles/colorPalette';


const PAGE_LIMIT = 5;

// ====================================================================

const OfferedCoursesPage: React.FC = () => {
    const [semesterId, setSemesterId] = useState<string>();
    const [page, setPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Resolve current semester on mount
    const { data: currentSemester, isLoading: currentSemesterLoading, error: currentSemesterError } = useCurrentSemester();

    useEffect(() => {
        if (currentSemester?.id) {
            setSemesterId(currentSemester.id);
        }
    }, [currentSemester]);

    // Fetch offered courses whenever semesterId or page changes
    const { data, isLoading: AdminOfferedCoursesLoading, error: AdminOfferedCoursesError } = useAdminOfferedCourses(semesterId, page, PAGE_LIMIT);

    const handleFilterApply = (newSemesterId: string | undefined) => {
        setSemesterId(newSemesterId);
        setPage(1); // reset to page 1 on filter change
    };

    if (currentSemesterLoading || AdminOfferedCoursesLoading) return (
        <Loading />
    );

    if (currentSemesterError || AdminOfferedCoursesError) return (
        <ErrorState />
    );

    // ====================================================================
    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy } }}>
            <div className="p-6">

                <div className="flex justify-between items-center mt-5 mb-10">
                    <h1 className="text-2xl font-bold text-gray-800 m-0">Offered Courses Management</h1>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Offered Course
                    </Button>
                </div>

                {/* Filter ---------------------------------------------*/}
                <OfferedCoursesFilterPanel
                    defaultSemesterId={semesterId}
                    onApply={handleFilterApply}
                />

                {/* Table --------------------------------------------*/}
                <OfferedCoursesTable
                    offeredCourses={data?.courses ?? []}
                    page={page}
                    limit={PAGE_LIMIT}
                    totalRows={data?.totalRows ?? 0}
                    setPage={setPage}
                    loading={AdminOfferedCoursesLoading}
                    error={AdminOfferedCoursesError ? (AdminOfferedCoursesError as any)?.message : undefined}
                />
            </div>

            {/* Add Modal -------------------------------------------*/}
            {semesterId && (
                <AddOfferedCourseModal
                    open={isAddModalOpen}
                    defaultSemesterId={semesterId}
                    onClose={() => setIsAddModalOpen(false)}
                />
            )}
        </ConfigProvider>
    );
};

export default OfferedCoursesPage;
