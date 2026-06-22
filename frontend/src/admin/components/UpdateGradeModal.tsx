import React, { useEffect, useState } from 'react';
import { Modal, Select, Typography } from 'antd';

// interface
import { CourseWithGrade } from '../interfaces/courses.interface';

//============================================================

const { Text } = Typography;

interface Props {
    open: boolean;
    course: CourseWithGrade | null;
    loading?: boolean;
    onCancel: () => void;
    onSubmit: (grade: string) => void;
}

//============================================================

const UpdateGradeModal: React.FC<Props> = ({
    open,
    course,
    loading,
    onCancel,
    onSubmit,
}) => {
    const [grade, setGrade] = useState<string>('');

    // sync modal state when opening
    useEffect(() => {
        if (course) {
            setGrade(course.grade || '');
        }
    }, [course]);

    const handleOk = () => {
        onSubmit(grade);
    };


    //============================================================
    return (
        <Modal
            title="Update Student Grade"
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={loading}
            okText="Save"
            cancelText="Cancel"
            centered
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {course && (
                    <div>
                        <Text strong>{course.code}</Text> — {course.title}
                    </div>
                )}

                <Select
                    value={grade}
                    onChange={setGrade}
                    style={{ width: '100%' }}
                    placeholder="Select grade"
                    options={[
                        { value: 'AA', label: 'AA' },
                        { value: 'AB', label: 'AB' },
                        { value: 'BA', label: 'BA' },
                        { value: 'BB', label: 'BB' },
                        { value: 'CB', label: 'CB' },
                        { value: 'CC', label: 'CC' },
                        { value: 'DC', label: 'DC' },
                        { value: 'DD', label: 'DD' },
                        { value: 'FF', label: 'FF' },
                    ]}
                />
            </div>
        </Modal>
    );
};

export default UpdateGradeModal;