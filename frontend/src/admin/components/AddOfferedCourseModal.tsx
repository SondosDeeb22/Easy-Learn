import React, { useEffect } from 'react';
import { Modal, Form, Select, Button, ConfigProvider, notification } from 'antd';
import { useQuery } from '@tanstack/react-query';

// hook
import { useAdminAvailableCourses, useCreateOfferedCourse } from '../hooks/offeredCourses.hook';
import { useAllSemesters } from '../hooks/semesters.hook';

// service
import { getCourses } from '../services/courses.service';

// style
import { colors } from '../../styles/colorPalette';


//interface
import { AddOfferedCourseModalProps } from '../interfaces/offeredCourses.interface';


// ====================================================================

const AddOfferedCourseModal: React.FC<AddOfferedCourseModalProps> = ({ open, defaultSemesterId, onClose }) => {
    const [form] = Form.useForm<{ courseId: string; semesterId: string }>();
    const { mutate: createOfferedCourse, isPending } = useCreateOfferedCourse();
    const [api, contextHolder] = notification.useNotification();

    const { data: semesters, isLoading: semestersLoading } = useAllSemesters();
    const { data: coursesData, isLoading: coursesLoading } = useAdminAvailableCourses(defaultSemesterId)

    useEffect(() => {
        if (open) {
            form.resetFields();
            if (defaultSemesterId) {
                form.setFieldsValue({ semesterId: defaultSemesterId });
            }
        }
    }, [open, defaultSemesterId, form]);

    const handleFinish = (values: { courseId: string; semesterId: string }) => {
        createOfferedCourse(values, {
            onSuccess: () => {
                api.success({ message: 'Course added to semester successfully!', placement: 'topRight' });
                onClose();
            },
            onError: (error: any) => {
                const errMsg: string = error?.message || 'Failed to add offered course';
                if (errMsg.includes('DUPLICATE_FIELD')) {
                    form.setFields([{ name: 'courseId', errors: ['This course is already offered in the selected semester'] }]);
                } else {
                    form.setFields([{ name: 'courseId', errors: [errMsg] }]);
                }
            },
        });
    };

    // ======================================================================================
    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy } }}>
            {contextHolder}
            <Modal
                title="Add Offered Course"
                open={open}
                onCancel={onClose}
                footer={[
                    <Button key="back" onClick={onClose}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={isPending} onClick={() => form.submit()}>
                        Add Course
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    style={{ marginTop: 20 }}
                >
                    <Form.Item
                        name="semesterId"
                        label="Semester"
                        rules={[{ required: true, message: 'Please select a semester' }]}
                    >
                        <Select
                            placeholder="Select semester"
                            loading={semestersLoading}
                            options={semesters?.map(s => ({ value: s.id, label: s.title }))}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="courseId"
                        label="Course"
                        rules={[{ required: true, message: 'Please select a course' }]}
                    >
                        <Select
                            placeholder="Select course"
                            loading={coursesLoading}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={coursesData?.courses?.map((c: any) => ({
                                value: c.id,
                                label: `${c.code} – ${c.title}`,
                            }))}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </ConfigProvider>
    );
};

export default AddOfferedCourseModal;
