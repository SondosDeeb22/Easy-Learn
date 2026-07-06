import React, { useState } from 'react';

import { TableColumnsType, Alert, Button, notification, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// components
import ReusableTable from '../../../shared/components/ReusableTable';
// generic componenets
import Loading from '../../../shared/components/Loading';
import ErrorState from "../../../shared/components/ErrorState";

//hook
import { useDeleteOfferedCourse } from '../hooks/offeredCourses.hook';

//style
import { colors } from '../../../styles/colorPalette';

//interface
import { OfferedCourse } from '../offeredCourses.interface';
// ====================================================================

interface OfferedCoursesTableProps {
    offeredCourses: OfferedCourse[];
    page: number;
    limit: number;
    totalRows: number;
    setPage: (page: number) => void;
    loading: boolean;
    error?: string;
}

// ====================================================

const OfferedCoursesTable: React.FC<OfferedCoursesTableProps> = ({
    offeredCourses,
    page,
    limit,
    totalRows,
    setPage,
    loading,
    error,
}) => {
    const [api, contextHolder] = notification.useNotification();
    const [selectedRow, setSelectedRow] = useState<OfferedCourse | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { mutate: deleteOfferedCourse } = useDeleteOfferedCourse();

    const handleOpenUpdateModal = (row: OfferedCourse) => {
        setSelectedRow(row);
    };

    const handleDelete = (row: OfferedCourse) => {
        const label = row.course ? `${row.course.code} – ${row.course.title}` : row.id;
        Modal.confirm({
            title: 'Remove Offered Course',
            content: `Are you sure you want to remove "${label}" from ${row.semester?.title ?? 'this semester'}?`,
            okText: 'Remove',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
                setDeletingId(row.id);
                deleteOfferedCourse(row.id, {
                    onSuccess: () => {
                        setDeletingId(null);
                        api.success({ message: 'Offered course removed successfully', placement: 'topRight' });
                    },
                    onError: () => {
                        setDeletingId(null);
                        api.error({ message: 'Failed to remove offered course', placement: 'topRight' });
                    },
                });
            },
        });
    };

    const columns: TableColumnsType<OfferedCourse> = [
        { title: 'Code', key: 'code', width: '12%', render: (_, r) => r.course?.code ?? '—', },
        { title: 'Course Title', key: 'title', width: '35%', render: (_, r) => r.course?.title ?? '—', },
        { title: 'Credits', key: 'credit', width: '10%', render: (_, r) => r.course?.credit ?? '—', },
        { title: 'Semester', key: 'semester', width: '23%', render: (_, r) => r.semester?.title ?? '—', },
        {
            title: 'Actions',
            key: 'actions',
            width: '20%',
            render: (_, record) => (
                <div className="flex gap-1 items-center justify-center">
                    {/* Update button */}
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleOpenUpdateModal(record)}
                        onMouseDown={(e) => e.preventDefault()}
                        style={{
                            color: colors.burgundy,
                            padding: 5,
                            border: '1px solid',
                            background: 'none',
                            boxShadow: 'none',
                        }}
                    >
                        Update
                    </Button>

                    {/* Delete button */}
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                        onMouseDown={(e) => e.preventDefault()}
                        loading={deletingId === record.id}
                        style={{
                            padding: 5,
                            border: '1px solid',
                            background: 'none',
                            boxShadow: 'none',
                        }}
                    >
                        Remove
                    </Button>
                </div>
            ),
        },
    ];

    if (loading) return (
        <Loading />
    );

    if (error) return (
        <ErrorState />
    );

    // =======================================================================================================================

    return (
        <>
            {contextHolder}

            <ReusableTable<OfferedCourse>
                data={offeredCourses}
                columns={columns}
                loading={loading}
                rowKey="id"
                emptyText="No offered courses found for this semester"
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

export default OfferedCoursesTable;
