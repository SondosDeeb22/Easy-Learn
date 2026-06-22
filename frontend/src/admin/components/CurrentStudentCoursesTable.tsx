import React from 'react';
import { TableColumnsType, Alert } from 'antd';

// interface
import { CourseWithGrade } from '../interfaces/courses.interface';

// component
import Reusable from "../../shared/components/ReusableTable";


// ====================================================
const columns: TableColumnsType<CourseWithGrade> = [
    { title: 'Code', dataIndex: 'code', key: 'code', width: "20%" },
    { title: 'Title', dataIndex: 'title', key: 'title', width: "40%" },
    { title: 'Credit', dataIndex: 'credit', key: 'credit', width: "20%" },
    { title: 'Grade', dataIndex: 'grade', key: 'grade', width: "20%" },
];

interface CurrentStudentCourses {
    currentCourses: CourseWithGrade[],
    loading: boolean,
    error?: string,
}
// ====================================================
const StudentCurrentCoursesTable: React.FC<CurrentStudentCourses> = ({
    currentCourses,
    loading,
    error,
}) => {

    if (error) return (
        <Alert
            title={error}
            type="error"
            showIcon
            style={{ margin: '16px 0', fontSize: '14px' }}
        />
    );

    // No pagination needed
    return (
        <Reusable<CourseWithGrade>
            data={currentCourses}
            columns={columns}
            loading={loading}
            rowKey="id"
            emptyText="You haven't enrolled in any courses this semester"
            pagination={false}
        />
    );
};

export default StudentCurrentCoursesTable;