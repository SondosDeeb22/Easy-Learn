import React from 'react';
import { useState } from 'react';
import { TableColumnsType, Alert, Button, notification, ConfigProvider } from 'antd';

// interface
import { CourseWithGrade } from '../interfaces/courses.interface';

// component
import Reusable from "../../shared/components/ReusableTable";
import UpdateGradeModal from './UpdateGradeModal';
//hook
import { useUpdateStudentGrade } from '../hooks/useUpdateStudentGrade';

import { colors } from '../../styles/colorPalette'
import { Color } from 'antd/es/color-picker';
// ====================================================


interface CurrentStudentCourses {
    currentCourses: CourseWithGrade[],
    loading: boolean,
    error?: string,
}

// ====================================================
const StudentCurrentCoursesTable: React.FC<CurrentStudentCourses> = ({
    currentCourses,
    loading,
    error,
}) => {
    const [api, contextHolder] = notification.useNotification();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseWithGrade | null>(null);

    const { mutate: updateGrade, isPending } = useUpdateStudentGrade();

    // ----------------------------------------------------------------------
    const handleOpenModal = (course: CourseWithGrade) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const handleSubmitGrade = (grade: string) => {
        if (!selectedCourse) return;
        console.log("selected course :", selectedCourse, "updated grade :", grade)

        updateGrade(
            {
                academicRecordId: selectedCourse.academicRecordId,
                grade,
            },
            {
                onSuccess: () => {
                    setIsModalOpen(false);
                    api.success({
                        title: "Grade updated successfully",
                        placement: "topRight",
                    });
                },
                onError: () => {
                    setIsModalOpen(false);
                    api.error({
                        title: "Failed to update grade",
                        placement: "topRight",
                    });
                }
            }
        );
    };

    // -------------------------------------------------------------
    const columns: TableColumnsType<CourseWithGrade> = [
        { title: 'Code', dataIndex: 'code', key: 'code', width: "20%" },
        { title: 'Title', dataIndex: 'title', key: 'title', width: "40%" },
        { title: 'Credit', dataIndex: 'credit', key: 'credit', width: "20%" },
        { title: 'Grade', dataIndex: 'grade', key: 'grade', width: "20%" },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    // type="link"
                    onClick={() => handleOpenModal(record)}
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

    // =============================================================================
    return (
        <>
            {contextHolder}
            <UpdateGradeModal
                open={isModalOpen}
                course={selectedCourse}
                loading={isPending}
                onCancel={() => setIsModalOpen(false)}
                onSubmit={handleSubmitGrade}
            />
            <div style={{ marginTop: 20 }}>
                <Reusable<CourseWithGrade>
                    data={currentCourses}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    emptyText="You haven't enrolled in any courses this semester"
                    // all courses should be viewed, no pagination needed
                    pagination={false}
                />
            </div>
        </>
    );
};

export default StudentCurrentCoursesTable;