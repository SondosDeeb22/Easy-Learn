import React, { useEffect, useState } from 'react';
import { Button, ConfigProvider, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// hooks
import { useAdminOfferedCourses, useCurrentSemester } from '../hooks/offeredCourses.hook';

// components
import OfferedCoursesFilterPanel from '../components/OfferedCoursesFilterPanel';
import OfferedCoursesTable from '../components/OfferedCoursesTable';
import AddOfferedCourseModal from '../components/AddOfferedCourseModal';

// styles
import { colors } from '../../styles/colorPalette';


const PAGE_LIMIT = 5;

// ====================================================================

const OfferedCoursesPage: React.FC = () => {
    const [semesterId, setSemesterId] = useState<string>();
    const [page, setPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Resolve current semester on mount
    const { data: currentSemester } = useCurrentSemester();

    useEffect(() => {
        if (currentSemester?.id) {
            setSemesterId(currentSemester.id);
        }
    }, [currentSemester]);

    // Fetch offered courses whenever semesterId or page changes
    const { data, isLoading, isError, error } = useAdminOfferedCourses(semesterId, page, PAGE_LIMIT);

    const handleFilterApply = (newSemesterId: string | undefined) => {
        setSemesterId(newSemesterId);
        setPage(1); // reset to page 1 on filter change
    };

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
                    loading={isLoading}
                    error={isError ? (error as any)?.message : undefined}
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
