import React, { useEffect, useState } from 'react';
import { Select, Button, ConfigProvider } from 'antd';
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
    const [selectedSemester, setSelectedSemester] = useState<string | undefined>(defaultSemesterId);

    // Once the current semester resolves, seed the filter
    useEffect(() => {
        if (defaultSemesterId) {
            setSelectedSemester(defaultSemesterId);
        }
    }, [defaultSemesterId]);

    const handleApply = () => {
        onApply(selectedSemester);
    };

    const handleClear = () => {
        setSelectedSemester(undefined);
        onApply(undefined);
    };

    // =====================================================================
    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy } }}>
            <div
                style={{
                    background: '#fff',
                    borderRadius: 10,
                    padding: '16px 20px',
                    marginBottom: 20,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-end',
                    gap: 12,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
            >
                <div style={{ flex: '1 1 220px', minWidth: 200 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4 }}>
                        Semester
                    </label>
                    <Select
                        placeholder="Select semester"
                        loading={isLoading}
                        value={selectedSemester ?? undefined}
                        options={semesters?.map(s => ({ value: s.id, label: s.title }))}
                        onChange={(value) => setSelectedSemester(value ?? undefined)}
                        allowClear
                        style={{ width: '100%' }}
                    />
                </div>

                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleApply}
                    style={{ minWidth: 100 }}
                >
                    Filter
                </Button>
                <Button
                    icon={<ClearOutlined />}
                    onClick={handleClear}
                    style={{ minWidth: 100 }}
                >
                    Clear
                </Button>
            </div>
        </ConfigProvider>
    );
};

export default OfferedCoursesFilterPanel;
