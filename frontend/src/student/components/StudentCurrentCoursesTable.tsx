import React from 'react';
import { TableColumnsType, Alert } from 'antd';
import { useStudentCurrentCourses } from '../hooks/StudnetCurrentCoursesHook';
import { Course } from '../interfaces/courses.interface';
import Reusable from "../../shared/components/ReusableTable";

// ====================================================
const columns: TableColumnsType<Course> = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Credit', dataIndex: 'credit', key: 'credit' },
    { title: 'Grade', dataIndex: 'grade', key: 'grade' },
];

// ====================================================
const StudentCurrentCoursesTable: React.FC = () => {
    const { data, loading, error } = useStudentCurrentCourses();

    if (error) return (
        <Alert
            message={error}
            type="error"
            showIcon
            style={{ margin: '16px 0', fontSize: '14px' }}
        />
    );

    const courses = data?.[0]?.courses ?? [];

    return (
        <Reusable<Course>
            data={courses}
            columns={columns}
            loading={loading}
            rowKey="code"
            emptyText="You haven't enrolled in any courses this semester"
        />
    );
};

export default StudentCurrentCoursesTable;