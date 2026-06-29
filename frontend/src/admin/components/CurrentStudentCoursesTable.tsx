import React from 'react';
import { useState } from 'react';
import { TableColumnsType, Alert, Button, notification, ConfigProvider } from 'antd';

import {
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';


// interface
import { CourseWithGrade } from '../interfaces/courses.interface';

// component
import Reusable from "../../shared/components/ReusableTable";
import UpdateGradeModal from './UpdateGradeModal';

import WithdrawStudentCourseModal from '../components/WithdrawStudentCourseModal';

//hook
import { useUpdateStudentGrade } from '../hooks/useUpdateStudentGrade';
import { useWithdrawStudentCourse } from '../hooks/useWithdrawStudentCourse';


import { colors } from '../../styles/colorPalette'
// ====================================================


interface CurrentStudentCourses {
    currentCourses: CourseWithGrade[],
    loading: boolean,
    error?: string,
    studentId: string
}



// ====================================================
const CurrentStudentCoursesTable: React.FC<CurrentStudentCourses> = ({
    currentCourses,
    loading,
    error,
    studentId
}) => {
    const [api, contextHolder] = notification.useNotification();

    const [selectedCourse, setSelectedCourse] = useState<CourseWithGrade | null>(null);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    const { mutate: updateGrade, isPending: isPendingUpdate } = useUpdateStudentGrade();

    const { mutate: withdrawStudent, isPending: isPendingWithdraw } = useWithdrawStudentCourse();
    // ----------------------------------------------------------------------


    // Update Modal  
    const handleOpenUpdateModal = (course: CourseWithGrade) => {
        setSelectedCourse(course);
        setIsUpdateModalOpen(true);
    };


    const handleSubmitGrade = (numericGrade: number) => {
        if (!selectedCourse) return;
        console.log("selected course :", selectedCourse, "updated grade :", numericGrade)

        updateGrade(
            {
                academicRecordId: selectedCourse.academicRecordId,
                numericGrade: Number(numericGrade),
            },
            {
                onSuccess: (res) => {
                    setIsUpdateModalOpen(false);
                    if (res && (res.data === false || res.message === 'common.crud.noChanges')) {
                        api.info({
                            title: "No changes were made",
                            placement: "topRight",
                        });
                    } else {
                        api.success({
                            title: "Grade updated successfully",
                            placement: "topRight",
                        });
                    }
                },
                onError: () => {
                    setIsUpdateModalOpen(false);
                    api.error({
                        title: "Failed to update grade",
                        placement: "topRight",
                    });
                }
            }
        );
    };

    // -----------------------------------

    // Withdraw Modal
    const handleOpenWithdrawModal = (course: CourseWithGrade) => {
        setSelectedCourse(course);
        setIsWithdrawModalOpen(true);
    };

    const handleConfirmWithdraw = () => {
        if (!selectedCourse) return;
        console.log("selected course :", selectedCourse)
        setIsWithdrawModalOpen(false);

        console.log("handle confirm withdraw executed")

        withdrawStudent(
            {
                studentId: studentId,
                courseId: selectedCourse.id,
            },
            {
                onSuccess: () => {
                    setIsWithdrawModalOpen(false);

                    api.success({
                        title: "Student withdraw successfully",
                        placement: "topRight",
                    });

                },
                onError: () => {
                    setIsWithdrawModalOpen(false);
                    api.error({
                        title: "Failed to withdraw course",
                        placement: "topRight",
                    });
                }
            }
        )
    };
    // -------------------------------------------------------------
    const columns: TableColumnsType<CourseWithGrade> = [
        { title: 'Code', dataIndex: 'code', key: 'code', width: "15%" },
        { title: 'Title', dataIndex: 'title', key: 'title', width: "40%" },
        { title: 'Credit', dataIndex: 'credit', key: 'credit', width: "15%" },
        { title: 'Numeric Grade', dataIndex: 'numericGrade', key: 'numericGrade', width: "15%" },
        { title: 'Letter Grade', dataIndex: 'letterGrade', key: 'letterGrade', width: "15%" },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (

                <div className="flex gap-1 items-center justify-center">
                    {/* Update course button --------------------------- */}

                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleOpenUpdateModal(record)}
                        onMouseDown={(e) => e.preventDefault()}// Prevents focus ring from persisting after mouse click
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

                    {/* Withdraw course button --------------------------- */}
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleOpenWithdrawModal(record)}
                        onMouseDown={(e) => e.preventDefault()}
                        style={{
                            color: colors.burgundy,
                            padding: 5,
                            border: '1px solid',
                            background: 'none',
                            boxShadow: 'none',
                        }}
                    >
                        Withdraw
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

    // =============================================================================
    return (
        <>
            {contextHolder}
            <UpdateGradeModal
                open={isUpdateModalOpen}
                course={selectedCourse}
                loading={isPendingUpdate}
                onCancel={() => setIsUpdateModalOpen(false)}
                onSubmit={handleSubmitGrade}
            />

            <WithdrawStudentCourseModal
                open={isWithdrawModalOpen}
                course={selectedCourse}
                loading={isPendingWithdraw}
                onCancel={() => setIsWithdrawModalOpen(false)}
                onSubmit={handleConfirmWithdraw}
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

export default CurrentStudentCoursesTable;