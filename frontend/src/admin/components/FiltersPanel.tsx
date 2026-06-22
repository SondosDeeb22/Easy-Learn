import React from 'react';
import { Select, Card, Button, Input, ConfigProvider } from 'antd';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';

import { useState } from 'react';

// hooks
import { useAllCourses } from '../hooks/useAllCourses';
import { useAllSemesters } from '../hooks/useAllSemesters';

// interfaces
import { StudentFilterParams } from '../interfaces/users.interface';

// styles
import { colors } from '../../styles/colorPalette';


// =================================================================================================

interface StudentFilterProps {
    onApply: (filters: StudentFilterParams) => void;
}

const StudentFilter: React.FC<StudentFilterProps> = ({ onApply }) => {

    const [studentId, setStudentId] = useState<string | null>(null);
    const [courseId, setCourseId] = useState<string | null>(null);
    const [semesterId, setSemesterId] = useState<string | null>(null);

    const { data: courses, loading: coursesLoading, error: coursesError } = useAllCourses();
    const { data: semesters, loading: semestersLoading, error: semestersError } = useAllSemesters();

    // ------------------------------------------------
    const handleApply = () => {
        onApply({
            studentId: studentId || undefined,
            courseId: courseId || undefined,
            semesterId: semesterId || undefined,
        });
    };

    const handleReset = () => {
        setStudentId(null);
        setCourseId(null);
        setSemesterId(null);
        onApply({});
    };
    // ------------------------------------------------

    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy, colorPrimaryBg: '#ecececff', colorPrimaryBgHover: "#ececec" } }}>
            <Card
                style={{
                    marginBottom: 24,
                    borderRadius: 12,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}
            >
                <label style={{ margin: '0 0 16px', fontWeight: 500, fontSize: 15, color: '#181818ff' }}>
                    Filter students by ID, course, or semester
                </label>
                <br /><br />

                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>


                    {/* get specific student by Student Id ------------------------------------------------------------------------ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
                        <label style={{ fontWeight: 500, fontSize: 13 }}>Student Id</label>
                        <Input
                            placeholder="Enter student ID"
                            size="large"
                            style={{ width: '100%' }}
                            value={studentId ?? ''}
                            onChange={(e) => {
                                const val = e.target.value || null;
                                setStudentId(val);
                                if (val) {
                                    setCourseId(null);
                                    setSemesterId(null);
                                }
                            }}
                            allowClear
                        />
                    </div>

                    {/* filter by Course -------------------------------------------------------------------------- */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
                        <label style={{ fontWeight: 500, fontSize: 13 }}>Course</label>
                        <Select
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                            }
                            placeholder="Select a course"
                            size="large"
                            style={{ width: '100%' }}
                            loading={coursesLoading}
                            value={courseId ?? undefined}
                            options={courses.map(c => ({ value: c.id, label: `${c.code} - ${c.title}` }))}
                            onChange={(value) => setCourseId(value ?? null)}
                            allowClear
                            disabled={!!studentId}
                        />
                    </div>

                    {/* filter by Semester -------------------------------------------------------------------------- */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
                        <label style={{ fontWeight: 500, fontSize: 13 }}>Semester</label>
                        <Select
                            placeholder="Select a semester"
                            size="large"
                            style={{ width: '100%' }}
                            loading={semestersLoading}
                            value={semesterId ?? undefined}
                            options={semesters.map(s => ({ value: s.id, label: s.title }))}
                            onChange={(value) => setSemesterId(value ?? null)}
                            allowClear
                            disabled={!!studentId}
                        />
                    </div>

                    {/* Action Buttons -------------------------------------------------------------------------- */}
                    <div style={{ display: 'flex', gap: 10, paddingBottom: 1, marginLeft: 'auto', }}>

                        {/* Apply Button ------------------------------------------------------------ */}
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            size="large"
                            onClick={handleApply}
                            style={{
                                backgroundColor: colors.burgundy,
                                borderColor: colors.burgundy,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = colors.burgundyHover;
                                e.currentTarget.style.borderColor = colors.burgundyHover;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = colors.burgundy;
                                e.currentTarget.style.borderColor = colors.burgundy;
                            }}
                        >
                            Apply
                        </Button>

                        {/* Reset Button -------------------------------------------- */}
                        <Button
                            icon={<ClearOutlined />}
                            size="large"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    </div>

                </div>
            </Card>
        </ConfigProvider>
    );
}

export default StudentFilter;