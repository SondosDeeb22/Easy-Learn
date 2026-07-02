import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Button, ConfigProvider } from 'antd';
import { useUpdateCourse } from '../hooks/useUpdateCourse';
import { Course } from '../interfaces/courses.interface';
import { colors } from '../../styles/colorPalette';
import { notification } from "antd";

// ====================================================================

interface UpdateCourseModalProps {
    open: boolean;
    course: Course | null;
    onClose: () => void;
}

// ====================================================================

const UpdateCourseModal: React.FC<UpdateCourseModalProps> = ({ open, course, onClose }) => {
    const [form] = Form.useForm<Course>();
    const { mutate: updateCourse, isPending } = useUpdateCourse();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (open && course) {
            form.setFieldsValue({
                id: course.id,
                code: course.code,
                title: course.title,
                credit: course.credit,
                active: course.active,
            });
        }
    }, [open, course, form]);

    const handleFinish = (values: Course) => {
        if (!course) return;
        
        // Ensure ID is included in values
        const updatePayload = {
            ...values,
            id: course.id,
        };

        updateCourse(updatePayload, {
            onSuccess: (res) => {
                if (res && (res.data === false || res.message === 'common.crud.noChanges')) {
                    api.info({
                        message: "No changes were made",
                        placement: "topRight",
                    });
                } else {
                    api.success({
                        message: "Course updated successfully!",
                        placement: "topRight",
                    });
                }
                onClose();
            },
            onError: (error: any) => {
                const errMsg: string = error?.message || 'Failed to update course';

                // Backend encodes which field caused the conflict as "DUPLICATE_FIELD:<fieldName>"
                if (errMsg.startsWith('DUPLICATE_FIELD:')) {
                    const conflictField = errMsg.replace('DUPLICATE_FIELD:', ''); // get the field name only 
                    const labelMap: Record<string, string> = {
                        code: 'Course Code',
                        title: 'Course Title',
                        credit: 'Credits',
                    };
                    const label = labelMap[conflictField] ?? conflictField;
                    form.setFields([{ name: conflictField as any, errors: [`${label} already exists`] }]);
                } else {
                    // Generic error
                    form.setFields([{ name: 'active', errors: [errMsg] }]);
                }
            },
        });
    };

    // ======================================================================================
    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy } }}>
            {contextHolder}
            <Modal
                title="Update Course"
                open={open}
                onCancel={onClose}
                footer={[
                    <Button key="back" onClick={onClose}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={isPending} onClick={() => form.submit()}>
                        Save
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
                        name="code"
                        label="Course Code"
                        rules={[{ required: true, message: "Course Code is required" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Course Title"
                        rules={[{ required: true, message: "Course Title is required" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="credit"
                        label="Credits"
                        rules={[
                            { required: true, message: "Credit is required" },
                            {
                                type: "number",
                                min: 1,
                                max: 10,
                                message: "Credit must be between 1 and 10",
                            },
                        ]}
                    >
                        <InputNumber controls={false} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="active"
                        label="Status"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                </Form>
            </Modal>
        </ConfigProvider>
    );
};

export default UpdateCourseModal;
