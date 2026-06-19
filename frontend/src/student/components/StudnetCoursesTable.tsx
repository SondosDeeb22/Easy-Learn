import React from 'react';
import { TableColumnsType, Alert } from 'antd';

// hooks
import { useStudentCourses } from '../hooks/studnetCoursesHook';

// interface
import { Course } from '../interfaces/courses.interface';

// reusable component
import Reusable from "../../shared/components/ReusableTable";

// ====================================================
const columns: TableColumnsType<Course> = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Credit', dataIndex: 'credit', key: 'credit' },
    { title: 'Grade', dataIndex: 'grade', key: 'grade' },
];

// ====================================================
const StudnetCoursesTable: React.FC = () => {
    const { data, loading, error } = useStudentCourses();

    if (error) return (
        <Alert
            message={error}
            type="error"
            showIcon
            style={{ margin: '16px 0', fontSize: '14px' }}
        />
    );

    const courses = data ?? [];

    return (
        <Reusable<Course>
            data={courses}
            columns={columns}
            loading={loading}
            rowKey="code"
            emptyText="You don't have any courses yet"
        />
    );
};

export default StudnetCoursesTable;