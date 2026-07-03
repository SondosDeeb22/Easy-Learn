import React, { useEffect, useState } from 'react';
import { Select, Button, Card, ConfigProvider } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { useAllSemesters } from '../hooks/semesters.hook';
import { colors } from '../../styles/colorPalette';

// ====================================================================

interface OfferedCoursesFilterPanelProps {
    defaultSemesterId?: string;
    onApply: (semesterId: string | undefined) => void;
}

// ====================================================================

const OfferedCoursesFilterPanel: React.FC<OfferedCoursesFilterPanelProps> = ({ defaultSemesterId, onApply }) => {
    const { data: semesters, isLoading } = useAllSemesters();
    console.log(`[frontend/offeredCoursesFilterPanel]\nresult: ${JSON.stringify(semesters?.semesters, null, 2)}}`)
    const [selectedSemester, setSelectedSemester] = useState<string | undefined>(defaultSemesterId);

    // Once the current semester resolves, seed the filter
    // useEffect(() => {
    //     if (defaultSemesterId) {
    //         setSelectedSemester(defaultSemesterId);
    //     }
    // }, [defaultSemesterId]);

    const handleApply = () => {
        onApply(selectedSemester);
    };

    const handleClear = () => {
        setSelectedSemester(undefined);
        onApply(undefined);
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
                    View offered courses by semester
                </label>

                <div className="mt-6 flex flex-wrap items-end gap-4">
                    {/* semester ------------------------------------------------ */}
                    <div className="flex min-w-[220px] flex-col gap-1.5">
                        <label className="font-medium text-[13px]">
                            Semester
                        </label>
                        <Select
                            showSearch
                            size="large"
                            style={{ width: '100%' }}
                            placeholder="Select semester"

                            loading={isLoading}
                            value={selectedSemester ?? undefined}
                            options={semesters?.semesters.map(s => ({ value: s.id, label: s.title }))}
                            onChange={(value) => setSelectedSemester(value ?? undefined)}

                            allowClear
                        />
                    </div>

                    {/* Buttons ----------------------------------------- */}
                    <div className="ml-auto flex gap-2.5 pb-[1px]">
                        <Button
                            type="primary"
                            size="large"
                            icon={<SearchOutlined />}
                            onClick={handleApply}
                        >
                            Apply
                        </Button>
                        <Button
                            size="large"
                            icon={<ClearOutlined />}
                            onClick={handleClear}
                        >
                            Clear
                        </Button>


                    </div>

                </div>

            </Card>
        </ConfigProvider>
    );
};

export default OfferedCoursesFilterPanel;
