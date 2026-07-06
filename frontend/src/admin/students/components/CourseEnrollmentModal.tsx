import React, { useEffect, useState } from 'react';
import { Modal, Select, Typography, Alert } from 'antd';

// hook
import { useStudentOfferedCourses } from '../hooks/useStudentOfferedCourses';
//============================================================

const { Text } = Typography;

interface Props {
    open: boolean;
    studentId: string;
    loading?: boolean;
    onCancel: () => void;
    onSubmit: (courseId: string) => void;
    error?: string | null;
}

//============================================================

const EnrollStudentInCourseModal: React.FC<Props> = ({ open, studentId, loading, onCancel, onSubmit, error }) => {

    const [courseId, setCourseId] = useState<string | null>(null);

    // offered courses is the available courses for registration according to the student credits
    const { data: offeredCourses, isLoading: offeredCoursesLoading } = useStudentOfferedCourses(studentId, 1, 100);

    useEffect(() => {
        if (open) {
            setCourseId(null);
        }
    }, [open]);

    const handleOk = () => {
        if (courseId) {
            onSubmit(courseId);
        }
    };

    //============================================================
    return (
        <Modal
            title="Enroll Student in a Course"
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={loading}
            okText="Confirm"
            cancelText="Cancel"
            okButtonProps={{ disabled: !courseId }}
            centered
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                    <Text strong>Add Course</Text>
                    <p>Enroll the Student in a Course from the courses below:</p>
                </div>

                <Select
                    placeholder="Select a course"
                    size="large"
                    style={{ width: '100%' }}
                    loading={offeredCoursesLoading}
                    value={courseId ?? undefined}
                    options={offeredCourses?.courses.map(course => ({ value: course.id, label: `${course.code} - ${course.title} - ${course.credit} credits` }))}
                    onChange={(value) => setCourseId(value)}
                    allowClear
                />
                
                {error && (
                    <Alert message={error} type="error" showIcon style={{ marginTop: 8 }} />
                )}
            </div>
        </Modal>
    );
};

export default EnrollStudentInCourseModal;