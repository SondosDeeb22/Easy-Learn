import React, { useState } from "react";
import { Card, Button, Input, Select, ConfigProvider } from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";

// Interfaces
import { CourseFilterParams } from "../interfaces/courses.interface";

// Styles
import { colors } from "../../styles/colorPalette";

// =====================================================================================

interface CoursesFilterProps {
    onApply: (filters: CourseFilterParams) => void;
}

// =====================================================================================

const CoursesFilterPanel: React.FC<CoursesFilterProps> = ({ onApply }) => {
    const [code, setCode] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    // ----------------------------------------------------------------

    const handleApply = () => {
        onApply({
            code: code || undefined,
            title: title || undefined,
            status: status || undefined,
        });
    };

    const handleReset = () => {
        setCode(null);
        setTitle(null);
        setStatus(null);
        onApply({});
    };

    // ----------------------------------------------------------------

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: colors.burgundy,
                    colorPrimaryBg: "#ecececff",
                    colorPrimaryBgHover: "#ececec",
                },
            }}
        >
            <Card className="mb-6 rounded-xl shadow-sm">
                <label className="text-[15px] font-medium text-gray-900">
                    Filter courses by code, title, or status
                </label>

                <div className="mt-6 flex flex-wrap items-end gap-4">

                    {/* Course Code ------------------------------------------------ */}
                    <div className="flex min-w-[220px] flex-col gap-1.5">
                        <label className="text-[13px] font-medium">
                            Course Code
                        </label>

                        <Input
                            placeholder="Enter course code"
                            size="large"
                            value={code ?? ""}
                            onChange={(e) => setCode(e.target.value || null)}
                            allowClear
                        />
                    </div>

                    {/* Course Title ----------------------------------------------- */}
                    <div className="flex min-w-[220px] flex-col gap-1.5">
                        <label className="text-[13px] font-medium">
                            Course Title
                        </label>

                        <Input
                            placeholder="Enter course title"
                            size="large"
                            value={title ?? ""}
                            onChange={(e) => setTitle(e.target.value || null)}
                            allowClear
                        />
                    </div>

                    {/* Status ----------------------------------------------------- */}
                    <div className="flex min-w-[220px] flex-col gap-1.5">
                        <label className="text-[13px] font-medium">
                            Status
                        </label>

                        <Select
                            placeholder="Select status"
                            size="large"
                            value={status ?? undefined}
                            allowClear
                            onChange={(value) => setStatus(value ?? null)}
                            options={[
                                {
                                    value: "true",
                                    label: "Active",
                                },
                                {
                                    value: "false",
                                    label: "Inactive",
                                },
                            ]}
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
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </Card>
        </ConfigProvider>
    );
};

export default CoursesFilterPanel;