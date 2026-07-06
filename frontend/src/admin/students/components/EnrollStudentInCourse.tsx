import React, { useState } from 'react';
import { Button, notification } from 'antd';

// hook
import { useEnrollStudentInCourse } from '../hooks/useEnrollStudentInCourse';

//style
import { colors } from '../../../styles/colorPalette';

// modal
import CourseEnrollmentModal from './CourseEnrollmentModal';

// ---------------------------------
interface Props {
    studentId: string;
}

// ==============================================

const EnrollStudentInCourse: React.FC<Props> = ({ studentId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const { mutate: enrollStudent, isPending } = useEnrollStudentInCourse();
    const [api, contextHolder] = notification.useNotification();

    const handleEnroll = (courseId: string) => {
        enrollStudent(
            { studentId, offeredCourseId: courseId },
            {
                onSuccess: () => {
                    setIsModalOpen(false);
                    api.success({
                        title: "Student enrolled successfully",
                        placement: "topRight",
                    });
                },
                onError: (error: any) => {
                    console.log(`[EnrollStudentInCourse Component] Error:`, error?.message);
                    setModalError(error?.message || "Something went wrong");
                }
            }
        );
    };

    // ====================================================================
    return (
        <div className="flex justify-end m-2">
            {contextHolder}
            <Button
                type="primary"
                size="large"
                onClick={() => {
                    setModalError(null);
                    setIsModalOpen(true);
                }}
                style={{
                    backgroundColor: colors.burgundy,
                    borderColor: colors.burgundy,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.burgundyHover;
                    e.currentTarget.style.borderColor = colors.burgundyHover;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.burgundy;
                    e.currentTarget.style.borderColor = colors.burgundy;
                }}
            >
                + Add Course
            </Button>

            <CourseEnrollmentModal
                open={isModalOpen}
                studentId={studentId}
                onCancel={() => setIsModalOpen(false)}
                onSubmit={handleEnroll}
                loading={isPending}
                error={modalError}
            />
        </div>
    );
};


export default EnrollStudentInCourse;