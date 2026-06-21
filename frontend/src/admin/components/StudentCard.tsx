import React from 'react';
import { Select, Card, Button, Input, ConfigProvider, Tag } from 'antd';
import { ClearOutlined, SearchOutlined, UserDeleteOutlined } from '@ant-design/icons';

import { useState } from 'react';

//interface
import { Student } from '../interfaces/users.interface';
// styles
import { colors } from '../../styles/colorPalette';

interface StudentCardProps {
    student: Student;
}
// =================================================================================================

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {

    // ------------------------------------------------

    return (
        <>
            {student ?
                // display Student Card if student exists -----------------------------------------------------
                // <div style={{ marginBottom: 24, maxWidth: 520 }}>
                //     <div style={{
                //         background: 'white',
                //         border: '0.5px solid #e5e7eb',
                //         borderRadius: 12,
                //         overflow: 'hidden',
                //     }}>
                //         {/* Header */}
                //         <div style={{
                //             padding: '1.25rem',
                //             display: 'flex',
                //             alignItems: 'center',
                //             gap: 14,
                //             borderBottom: '0.5px solid #e5e7eb',
                //         }}>
                //             <div>
                //                 <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: '#111' }}>{student.name}</p>
                //                 <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>ID: {student.id}</p>
                //             </div>
                //             <div style={{ marginLeft: 'auto' }}>
                //                 <span style={{
                //                     fontSize: 12, padding: '4px 10px',
                //                     borderRadius: 6, background: '#f3f4f6',
                //                     color: '#6b7280', border: '0.5px solid #e5e7eb',
                //                 }}>
                //                     {student.gender}
                //                 </span>
                //             </div>
                //         </div>

                //         {/* Stats */}
                //         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                //             <div style={{ padding: '1rem 1.25rem', borderRight: '0.5px solid #e5e7eb' }}>
                //                 <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6b7280' }}>Semester credits</p>
                //                 <p style={{ margin: 0, fontSize: 22, fontWeight: 500, color: '#111' }}>{student.currentSemesterCredits}</p>
                //             </div>
                //             <div style={{ padding: '1rem 1.25rem' }}>
                //                 <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6b7280' }}>Total credits</p>
                //                 <p style={{ margin: 0, fontSize: 22, fontWeight: 500, color: '#111' }}>{student.totalCredits}</p>
                //             </div>
                //         </div>
                //     </div>
                // </div>


                <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy } }}>
                    <Card
                        style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', maxWidth: '100%' }}
                    >
                        {/* Header - name, id, gender --------------------------------------------------------------------*/}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>{student.name}</p>
                                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>ID: {student.id}</p>
                            </div>
                            <div style={{ marginLeft: 'auto' }}>
                                <Tag>{student.gender}</Tag>
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
                    </Card>
                </ConfigProvider>

                // display this if no record found for this studentId
                : <Card
                    style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', maxWidth: 520 }}
                >
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
            }
        </>
    );
};

export default StudentCard;