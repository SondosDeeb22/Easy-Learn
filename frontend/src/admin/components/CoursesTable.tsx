import React, { useState } from 'react';
import { TableColumnsType, Alert, Tag, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

//interface
import { Course } from '../interfaces/courses.interface';
// reusable component
import ReusableTable from "../../shared/components/ReusableTable";
import UpdateCourseModal from './UpdateCourseModal';

import { colors } from '../../styles/colorPalette';

interface CoursesTableProps {
    courses: Course[];
    page: number,
    limit: number,
    totalRows: number,
    setPage: (page: number) => void,
    loading: boolean;
    error?: string;
}

// ====================================================

const CoursesTable: React.FC<CoursesTableProps> = ({
    courses,
    page,
    limit,
    totalRows,
    setPage,
    loading,
    error,
}) => {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const handleOpenUpdateModal = (course: Course) => {
        setSelectedCourse(course);
        setIsUpdateModalOpen(true);
    };

    const columns: TableColumnsType<Course> = [
        { title: "Course Code", dataIndex: "code", key: "code", width: "15%" },
        { title: "Course Title", dataIndex: "title", key: "title", width: "35%" },
        { title: "Credits", dataIndex: "credit", key: "credit", width: "15%" },
        {
            title: "Status",
            dataIndex: "active",
            key: "active",
            width: "15%",
            render: (active: boolean) => (
                <Tag color={active ? 'green' : 'red'}>
                    {active ? 'Active' : 'Inactive'}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: "20%",
            render: (_, record) => (
                <div className="flex gap-1 items-center justify-center">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleOpenUpdateModal(record)}
                        onMouseDown={(e) => e.preventDefault()} // Prevents focus ring from persisting after mouse click
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
                </div>
            ),
        },
    ];

    if (error) return (
        <Alert
            title={error}
            type="error"
            showIcon
            style={{ margin: '16px 0', fontSize: '14px' }}
        />
    );

    // =======================================================================================================================

    return (
        <>
            <UpdateCourseModal
                open={isUpdateModalOpen}
                course={selectedCourse}
                onClose={() => setIsUpdateModalOpen(false)}
            />
            <ReusableTable<Course>
                data={courses}
                columns={columns}
                loading={loading}
                rowKey="id"
                emptyText="No courses found"
                pagination={{
                    current: page,
                    total: totalRows,
                    pageSize: limit,
                    onChange: (newPage) => setPage(newPage),
                }}
            />
        </>
    );
}

export default CoursesTable;

