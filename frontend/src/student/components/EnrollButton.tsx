import React, { useState } from 'react';
import { Modal } from 'antd';

// interface
import { OfferedCourses } from '../interfaces/courses.interface';

// ====================================================================

interface EnrollButtonProps {
    selectedCourse: OfferedCourses | null;
    onConfirm: () => void;
}

// ====================================================================

const EnrollButton: React.FC<EnrollButtonProps> = ({ selectedCourse, onConfirm }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEnrollClick = () => {
        if (!selectedCourse) return;
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        onConfirm();
        setIsModalOpen(false);
        selectedCourse = null
    };

    // ====================================================================
    // ====================================================================

    return (
        <>
            {/* Enroll Button */}
            <button
                onClick={handleEnrollClick}
                disabled={!selectedCourse}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${selectedCourse
                        ? 'bg-burgundy text-white cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
            >
                + Enroll
            </button>

            {/* ==================================================================== */}
            {/* Confirmation Modal */}
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
            >
                {/* Course Details */}
                <div className="mb-4">
                    <h3 className="text-base font-medium mb-3">Confirm enrollment</h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-xs text-gray-500 mb-1">Selected course</p>
                        <p className="font-medium">{selectedCourse?.title}</p>
                        <p className="text-sm text-gray-500">
                            {selectedCourse?.code} · {selectedCourse?.credit} credits
                        </p>
                    </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
                    <span className="text-amber-600 mt-0.5">⚠</span>
                    <p className="text-sm text-amber-800">
                        Once enrolled, you cannot remove this course yourself.<br />
                        Contact your advisor if you need to drop it.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 text-sm bg-burgundy text-white rounded-lg font-medium"
                    >
                        Confirm enrollment
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default EnrollButton;