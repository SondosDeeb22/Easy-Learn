import React from 'react';
import { TableColumnsType } from 'antd';
import { useCurrentSemesterCourses } from '../hooks/currentSemesterCoursesHook';
import { Course } from '../interfaces/course.interface';
import Reusable from "../../shared/components/ReusableTable";

// ====================================================
const columns: TableColumnsType<Course> = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Credit', dataIndex: 'credit', key: 'credit' },
    { title: 'Grade', dataIndex: 'grade', key: 'grade' },
];

// ====================================================
const CurrentSemesterCoursesTable: React.FC = () => {
    const { data, loading, error } = useCurrentSemesterCourses();

    if (error) return <div>{error}</div>

    const courses = data?.[0]?.courses ?? [];

    return (
        <Reusable<Course>
            data={courses}
            columns={columns}
            loading={loading}
            rowKey="code"
        />
    );
};

export default CurrentSemesterCoursesTable;