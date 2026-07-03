import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, ConfigProvider, notification } from 'antd';
import { useCreateSemester } from '../hooks/semesters.hook';
import { Semester } from '../interfaces/semesters.interface';
import { colors } from '../../styles/colorPalette';

// ====================================================================

interface AddSemesterModalProps {
    open: boolean;
    onClose: () => void;
}


// ====================================================================

const AddSemesterModal: React.FC<AddSemesterModalProps> = ({ open, onClose }) => {
    const [form] = Form.useForm<Semester>();
    const { mutate: createSemester, isPending } = useCreateSemester();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleFinish = (values: Semester) => {
        createSemester(values, {
            onSuccess: () => {
                api.success({
                    message: "Semester created successfully!",
                    placement: "topRight",
                });
                // Wait briefly for user to see toast before close, or close immediately and let hook invalidate query
                onClose();
            },
            onError: (error: any) => {
                const errMsg: string = error?.message || 'Failed to create semester';
                if (errMsg.startsWith('DUPLICATE_FIELD:')) {
                    form.setFields([{ name: 'title', errors: ['Semester title already exists'] }]);
                } else {
                    form.setFields([{ name: 'title', errors: [errMsg] }]);
                }
            },
        });
    };

    // ====================================================================

    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy } }}>
            {contextHolder}
            <Modal
                title="Add New Semester"
                open={open}
                onCancel={onClose}
                footer={[
                    <Button key="back" onClick={onClose}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={isPending} onClick={() => form.submit()}>
                        Add Semester
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    style={{ marginTop: 20 }}
                >
                    {/* Semester Title ------------------------------------------------------------------------ */}
                    <Form.Item
                        name="title"
                        label="Semester Title"
                        rules={[{ required: true, message: "Semester Title is required" }]}
                    >
                        <Input placeholder="e.g. Fall 2026-2027" />
                    </Form.Item>

                    {/*Start Date ------------------------------------------------------------------------ */}
                    <Form.Item
                        name="startDate"
                        label="Start Date"
                        rules={[{ required: true, message: "Start Date is required" }]}
                    >
                        <Input type="date" />
                    </Form.Item>

                    {/* End Date ------------------------------------------------------------------------ */}
                    <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[{ required: true, message: "End Date is required" }]}
                    >
                        <Input type="date" />
                    </Form.Item>

                    {/* max credit ------------------------------------------------------------------------ */}
                    <Form.Item
                        name="maxCredits"
                        label="Max Credits"
                        rules={[
                            { required: true, message: "Max Credits is required" },
                            {
                                type: "number",
                                min: 1,
                                max: 30,
                                message: "Max credits must be between 1 and 30",
                            },
                        ]}
                    >
                        <InputNumber controls={true} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </ConfigProvider>
    );
};

export default AddSemesterModal;
