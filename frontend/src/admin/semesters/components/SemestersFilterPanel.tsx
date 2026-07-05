import React, { useState } from 'react';
import { Input, Button, ConfigProvider, Card, DatePicker } from 'antd';
import { SearchOutlined, ClearOutlined, setTwoToneColor } from '@ant-design/icons';
import dayjs from 'dayjs'; // js library for date manipulation, used in Ant Desing component DatePicker
// style
import { colors } from '../../../styles/colorPalette';

// ====================================================================

interface SemestersFilterPanelProps {
    onApply: (filters: { title?: string; date?: string }) => void;
}

// ====================================================================

const SemestersFilterPanel: React.FC<SemestersFilterPanelProps> = ({ onApply }) => {
    const [title, setTitle] = useState<string | null>(null);
    const [date, setDate] = useState<string | null>(null);

    const handleApply = () => {
        onApply({
            title: title?.trim() || undefined,
            date: date || undefined,
        });
    };

    const handleClear = () => {
        setTitle('');
        setDate('');
        onApply({});
    };

    // =====================================================================
    return (
        <ConfigProvider theme={{
            token: {
                colorPrimary: colors.burgundy,
                colorPrimaryBg: "#ecececff",
                colorPrimaryBgHover: "#ececec",
            },
        }}>
            <Card className="mb-6 rounded-xl shadow-sm">
                <label className="text-[15px] font-medium text-gray-900">
                    Filter Semesters by  title, or date
                </label>

                <div className="mt-6 flex flex-wrap items-end gap-4">


                    {/* semester title ------------------------------------------------ */}
                    <div className="flex min-w-[220px] flex-col gap-1.5">
                        <label className="text-[13px] font-medium">
                            Semester Title
                        </label>

                        <Input
                            placeholder="Enter Semester title"
                            size="large"
                            value={title ?? ""}
                            onChange={(e) => {
                                const value = e.target.value || null;
                                setTitle(value);
                                if (value) {
                                    setDate(null);
                                }
                            }}
                            allowClear
                            onPressEnter={handleApply}
                        />
                    </div>


                    {/* specific data ------------------------------------------------ */}
                    <div className="flex min-w-[220px] flex-col gap-1.5">
                        <label className="text-[13px] font-medium">
                            Specific Date
                        </label>

                        <DatePicker
                            size="large"
                            style={{ width: "100%" }}
                            placeholder="Select date"

                            value={date ? dayjs(date) : null} // convert string data to dayjs object (because DatePicker expects dayjs object)
                            onChange={(value) => {
                                const dateString = value ? value.format("YYYY-MM-DD") : null;
                                setDate(dateString);

                                if (dateString) {
                                    setTitle(null);
                                }
                            }}
                            allowClear
                        />
                    </div>



                    {/* Buttons ---------------------------------------------------- */}
                    <div className="ml-auto flex gap-2.5 pb-[1px]">

                        <Button
                            type="primary"
                            size="large"
                            icon={<SearchOutlined />}
                            onClick={handleApply}
                            style={{
                                backgroundColor: colors.burgundy,
                                borderColor: colors.burgundy,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    colors.burgundyHover;
                                e.currentTarget.style.borderColor =
                                    colors.burgundyHover;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    colors.burgundy;
                                e.currentTarget.style.borderColor =
                                    colors.burgundy;
                            }}
                        >
                            Apply
                        </Button>

                        <Button
                            size="large"
                            icon={<ClearOutlined />}
                            onClick={handleClear}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </Card>

        </ConfigProvider >
    );
};

export default SemestersFilterPanel;
