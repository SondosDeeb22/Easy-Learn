import React, { useState } from 'react';
import { Button, ConfigProvider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// hooks
import { useFilteredSemesters } from '../hooks/semesters.hook';

// components
import SemestersFilterPanel from '../components/SemestersFilterPanel';
import SemestersTable from '../components/SemestersTable';
import AddSemesterModal from '../components/AddSemesterModal';

// styles
import { colors } from '../../styles/colorPalette';

const PAGE_LIMIT = 5;

// ====================================================================

const SemestersPage: React.FC = () => {
    const [filters, setFilters] = useState<{ title?: string; date?: string }>({});
    const [page, setPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Fetch semesters based on filters and page/limit pagination parameters
    const { data, isLoading, isError, error } = useFilteredSemesters({
        ...filters,
        page,
        limit: PAGE_LIMIT,
    });

    // Safely handle both paginated objects and array responses
    const semestersList = Array.isArray(data) ? data : (data?.semesters ?? []);
    const totalRows = Array.isArray(data) ? data.length : (data?.totalRows ?? 0);

    const handleFilterApply = (newFilters: { title?: string; date?: string }) => {
        setFilters(newFilters);
        setPage(1); // reset to page 1 on filter change
    };

    // ====================================================================
    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy } }}>
            <div className="p-6">

                <div className="flex justify-between items-center mt-5 mb-10">
                    <h1 className="text-2xl font-bold text-gray-800 m-0">Semester Management</h1>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddModalOpen(true)}
                        size="large"
                    >
                        Insert Semester
                    </Button>
                </div>

                {/* Filter ---------------------------------------------*/}
                <SemestersFilterPanel
                    onApply={handleFilterApply}
                />

                {/* Table --------------------------------------------*/}
                <SemestersTable
                    semesters={semestersList}
                    page={page}
                    limit={PAGE_LIMIT}
                    totalRows={totalRows}
                    setPage={setPage}
                    loading={isLoading}
                    error={isError ? (error as any)?.message : undefined}
                />
            </div>

            {/* Add Modal -------------------------------------------*/}
            <AddSemesterModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </ConfigProvider>
    );
};

export default SemestersPage;
