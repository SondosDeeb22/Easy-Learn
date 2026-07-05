import React from 'react';
import { TableColumnsType, Alert } from 'antd';

// interface
import { CourseWithGrade } from '../courses.interface';

// reusable component
import ReusableTable from "../../../shared/components/ReusableTable";

// ====================================================
const columns: TableColumnsType<CourseWithGrade> = [
    { title: 'Code', dataIndex: 'code', key: 'code', width: "20%" },
    { title: 'Title', dataIndex: 'title', key: 'title', width: "40%" },
    { title: 'Credit', dataIndex: 'credit', key: 'credit', width: "20%" },
    { title: 'Grade', dataIndex: 'letterGrade', key: 'letterGrade', width: "20%" },
];

interface AllStudentCourses {
    allCourses: CourseWithGrade[];
    loading: boolean;
    error?: string;
    page: number;
    limit: number;
    totalRows: number;
    setPage: (page: number) => void;
}
// ====================================================
const StudnetCoursesTable: React.FC<AllStudentCourses> = ({
    allCourses,
    loading,
    error,
    page,
    limit,
    totalRows,
    setPage
}) => {

    if (error) return (
        <Alert
            title={error}
            type="error"
            showIcon
            style={{ margin: '16px 0', fontSize: '14px' }}
        />
    );
    console.log(`/offeredCoursesTable\nlimit: ${limit}, page: ${page}, totalRows: ${totalRows}\nCourses:${JSON.stringify(allCourses, null, 0)}`);

    // =======================================================================================================================

    return (
        <ReusableTable<CourseWithGrade>
            data={allCourses}
            columns={columns}
            loading={loading}
            rowKey="id"
            emptyText="You don't have any courses yet"
            pagination={{
                current: page,
                pageSize: limit,
                total: totalRows,
                onChange: (newPage) => setPage(newPage)
            }}
        />
    );
};

export default StudnetCoursesTable;