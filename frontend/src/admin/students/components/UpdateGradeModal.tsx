import React, { useEffect, useState } from 'react';
import { Modal, Select, Typography } from 'antd';

// interface
import { CourseWithGrade } from '../../courses/courses.interface';

//============================================================

const { Text } = Typography;

interface Props {
    open: boolean;
    course: CourseWithGrade | null;
    loading?: boolean;
    onCancel: () => void;
    onSubmit: (numericGrade: number) => void;
}

//============================================================

const UpdateGradeModal: React.FC<Props> = ({
    open,
    course,
    loading,
    onCancel,
    onSubmit,
}) => {
    const [gradeInput, setGradeInput] = useState<string>('');

    const gradeValue = gradeInput === '' ? null : Number(gradeInput);
    const isInvalid = gradeValue !== null && (gradeValue < 0 || gradeValue > 100);
    const isEmpty = gradeInput === '';



    // sync modal state when opening
    useEffect(() => {
        if (course) {
            setGradeInput(course.numericGrade?.toString() ?? '');
        }
    }, [course]);

    const handleOk = () => {
        if (gradeValue !== null && !isInvalid && !isEmpty) {
            onSubmit(gradeValue);
        }
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
            okButtonProps={{ disabled: isEmpty || isInvalid }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {course && (
                    <div>
                        <Text strong>{course.code}</Text> — {course.title}
                    </div>
                )}

                <div className="relative w-full">
                    <input
                        id="gradeInput"
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Enter grade (0–100)"
                        value={gradeInput}
                        onChange={(e) => setGradeInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleOk()} // allow user to press enter to submit

                        className={`
                            w-full h-[42px] pr-10 pl-3.5 text-[15px]
                            bg-white border-[1.5px] rounded-lg outline-none
                            transition-all duration-150
                            placeholder:text-gray-400
                            focus:border-burgundy focus:ring-2 focus:ring-burgundy/15
                            hover:border-burgundy
                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                            ${isInvalid
                                ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-300 hover:border-burgundy focus:border-burgundy focus:ring-2 focus:ring-burgundy/15'}
                            `}
                    />
                    {isInvalid && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <span>⚠</span> Grade must be between 0 and 100.
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default UpdateGradeModal;