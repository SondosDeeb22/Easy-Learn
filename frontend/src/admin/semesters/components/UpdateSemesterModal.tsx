import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, ConfigProvider, notification } from 'antd';
import { useUpdateSemester } from '../semesters.hook';
import { Semester } from '../semesters.interface';
import { colors } from '../../../styles/colorPalette';

// ====================================================================

interface UpdateSemesterModalProps {
    open: boolean;
    semester: Semester | null;
    onClose: () => void;
}

// ====================================================================

const formatDateToYYYYMMDD = (dateInput?: string | Date) => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const UpdateSemesterModal: React.FC<UpdateSemesterModalProps> = ({ open, semester, onClose }) => {
    const [form] = Form.useForm<Semester>();
    const { mutate: updateSemester, isPending } = useUpdateSemester();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (open && semester) {
            form.setFieldsValue({
                id: semester.id,
                title: semester.title,
                startDate: formatDateToYYYYMMDD(semester.startDate) as any,
                endDate: formatDateToYYYYMMDD(semester.endDate) as any,
                maxCredits: semester.maxCredits,
            });
        }
    }, [open, semester, form]);

    const handleFinish = (values: Semester) => {
        if (!semester) return;

        const updatePayload = {
            ...values,
            id: semester.id,
        };

        updateSemester(updatePayload, {
            onSuccess: (res) => {
                if (res && (res.data === false || res.message === 'No changes were made')) {
                    api.info({
                        message: "No changes were made",
                        placement: "topRight",
                    });
                } else {
                    api.success({
                        message: "Semester updated successfully!",
                        placement: "topRight",
                    });
                }
                onClose();
            },
            onError: (error: any) => {
                const errMsg: string = error?.message || 'Failed to update semester';
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
                title="Update Semester"
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
                        name="title"
                        label="Semester Title"
                        rules={[{ required: true, message: "Semester Title is required" }]}
                    >
                        <Input placeholder="e.g. Fall 2026-2027" />
                    </Form.Item>

                    <Form.Item
                        name="startDate"
                        label="Start Date"
                        rules={[{ required: true, message: "Start Date is required" }]}
                    >
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[{ required: true, message: "End Date is required" }]}
                    >
                        <Input type="date" />
                    </Form.Item>

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

export default UpdateSemesterModal;
