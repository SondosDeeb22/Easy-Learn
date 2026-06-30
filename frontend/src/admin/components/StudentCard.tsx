import React from 'react';
import { Select, Card, Button, Input, ConfigProvider, Tag } from 'antd';
import { ClearOutlined, SearchOutlined, UserDeleteOutlined } from '@ant-design/icons';



//interface
import { Student } from '../interfaces/users.interface';
// styles
import { colors } from '../../styles/colorPalette';

// component
import StudentCurrentCoursesTable from '../components/CurrentStudentCoursesTable';
import EnrollStudentInCourse from '../components/EnrollStudentInCourse';


//hook
import { useStudentCurrentCourses } from "../hooks/useCurrentStudentCourses";

interface StudentCardProps {
    student: Student;
}
// =================================================================================================

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
    const studentId = student?.id ?? "";
    const { data: studentCurrentSemesterCourses, isLoading: coursesLoading, isError: coursesError } = useStudentCurrentCourses(studentId);

    return (
        <>
            {student ? (
                // view student data card and courses if student was found with this id -------------------------------------------------
                <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy } }}>
                    <Card style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', maxWidth: '100%' }}>
                        {/* Header - name, id, gender */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            marginBottom: 16,
                            padding: '16px',
                            margin: '-24px -24px 16px -24px',
                            background: colors.burgundy,
                            borderRadius: '12px 12px 0 0'
                        }}>
                            <div>
                                <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: 'white' }}>{student.name}</p>
                                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>ID: {student.id}</p>
                            </div>
                            <div style={{ marginLeft: 'auto' }}>
                                <Tag style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', background: 'rgba(255,255,255,0.15)' }}>
                                    {student.gender}
                                </Tag>
                            </div>
                        </div>

                        {/* Stats - credits data ---------------------------------------------------------------- */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 16px' }}>
                                <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6b7280' }}>Semester credits</p>
                                <p style={{ margin: 0, fontSize: 22, fontWeight: 500 }}>{student.currentSemesterCredits}</p>
                            </div>
                            <div style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 16px' }}>
                                <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6b7280' }}>Total credits</p>
                                <p style={{ margin: 0, fontSize: 22, fontWeight: 500 }}>{student.totalCredits}</p>
                            </div>
                        </div>




                        {/* Add Course Button --------------------------------------------------------------------- */}
                        <EnrollStudentInCourse studentId={studentId} />

                        {/* Courses Table ------------------------------------------------------------------------*/}
                        <StudentCurrentCoursesTable
                            currentCourses={studentCurrentSemesterCourses?.courses || []}
                            loading={coursesLoading}
                            error={coursesError ? "Failed to load courses" : undefined}
                            studentId={studentId}
                        />
                    </Card>
                </ConfigProvider>
            ) : (
                // Not Found state - display this if no record found for this studentId --------------------------------------------------------------

                <Card style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', maxWidth: "100%" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '24px 0' }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: '50%',
                            background: '#fef2f2', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <UserDeleteOutlined style={{ fontSize: 20, color: '#ef4444' }} />
                        </div>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Student not found</p>
                        <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>No student was found with this ID</p>
                    </div>
                </Card>
            )}
        </>
    );
};

export default StudentCard;