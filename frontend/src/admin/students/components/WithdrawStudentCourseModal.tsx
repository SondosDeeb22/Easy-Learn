import React, { useEffect, useState } from 'react';
import { Modal, Select, Typography, Alert } from 'antd';

// interface
import { CourseWithGrade } from '../../courses/courses.interface';

//============================================================

const { Text } = Typography;

interface Props {
    open: boolean;
    course: CourseWithGrade | null;
    loading?: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    error?: string | null;
}

//============================================================

const WithdrawStudentCourseModal: React.FC<Props> = ({
    open,
    course,
    loading,
    onCancel,
    onSubmit,
    error,
}) => {




    // sync modal state when opening
    useEffect(() => {
        if (course) {
        }
    }, [course]);

    const handleOk = () => {
        onSubmit();
    };


    //============================================================
    return (
        <Modal
            title={`Withdraw Student From ${course?.title}`}
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={loading}
            okText="Confirm"
            cancelText="Cancel"
            centered
        >
            <div className="flex flex-col gap-3">
                {course && (
                    <div>
                        <Text strong>{course.code}</Text> — {course.title}
                    </div>
                )}

                <div className="relative w-full m-0">
                    <p className=' text-red-500'>Are you sure you want to withdraw this course?</p>
                </div>

                {error && (
                    <Alert title={error} type="error" showIcon style={{ marginTop: 8 }} />
                )}
            </div>
        </Modal>
    );
};

export default WithdrawStudentCourseModal;