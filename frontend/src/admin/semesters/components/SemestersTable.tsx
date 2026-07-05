import React, { useState } from 'react';
import { TableColumnsType, Alert, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

// interfaces
import { Semester } from '../semesters.interface';

// components
import ReusableTable from '../../../shared/components/ReusableTable';
import UpdateSemesterModal from './UpdateSemesterModal';

// style
import { colors } from '../../../styles/colorPalette';

// ========================================================================

interface SemestersTableProps {
    semesters: Semester[];
    page: number;
    limit: number;
    totalRows: number;
    setPage: (page: number) => void;
    loading: boolean;
    error?: string;
}
// ========================================================================

const SemestersTable: React.FC<SemestersTableProps> = ({
    semesters,
    page,
    limit,
    totalRows,
    setPage,
    loading,
    error,
}) => {
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const handleOpenUpdateModal = (semester: Semester) => {
        setSelectedSemester(semester);
        setIsUpdateModalOpen(true);
    };

    const formatDate = (dateVal?: string) => {
        if (!dateVal) return '-';
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const columns: TableColumnsType<Semester> = [
        {
            title: "Semester Title",
            dataIndex: "title",
            key: "title",
            width: "35%",
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            width: "20%",
            render: (val) => formatDate(val),
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
            width: "20%",
            render: (val) => formatDate(val),
        },
        {
            title: "Max Credits",
            dataIndex: "maxCredits",
            key: "maxCredits",
            width: "10%",
        },
        {
            title: "Actions",
            key: "actions",
            width: "15%",
            render: (_, record) => (
                <div className="flex gap-1 items-center justify-center">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleOpenUpdateModal(record)}
                        onMouseDown={(e) => e.preventDefault()}
                        style={{
                            color: colors.burgundy,
                            padding: '4px 8px',
                            border: '1px solid',
                            background: 'none',
                            boxShadow: 'none',
                        }}
                    >
                        Update
                    </Button>
                </div>
            ),
        },
    ];

    if (error) return (
        <Alert
            message={error}
            type="error"
            showIcon
            style={{ margin: '16px 0', fontSize: '14px' }}
        />
    );

    return (
        <>
            <UpdateSemesterModal
                open={isUpdateModalOpen}
                semester={selectedSemester}
                onClose={() => setIsUpdateModalOpen(false)}
            />
            <ReusableTable<Semester>
                data={semesters}
                columns={columns}
                loading={loading}
                rowKey="id"
                emptyText="No semesters found"
                pagination={{
                    current: page,
                    total: totalRows,
                    pageSize: limit,
                    onChange: (newPage) => setPage(newPage),
                }}
            />
        </>
    );
};

export default SemestersTable;
