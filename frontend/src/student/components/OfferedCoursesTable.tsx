import { useState } from 'react';
import { TableColumnsType, Alert } from 'antd';

// interface
import { CourseWithGrade } from '../interfaces/courses.interface';

// reusable table component
import ReusableSelectTable from '../../shared/components/ReusableSelectTable';

// ====================================================
const columns: TableColumnsType<CourseWithGrade> = [
    { title: 'Code', dataIndex: 'code', key: 'code', width: "20%" },
    { title: 'Title', dataIndex: 'title', key: 'title', width: "60%" },
    { title: 'Credit', dataIndex: 'credit', key: 'credit', width: "20%" },
];

interface OfferedCoursesTableProps {
    offeredCourses: CourseWithGrade[];
    loading: boolean;
    error?: string;
    page: number;
    limit: number;
    totalRows: number;
    setPage: (page: number) => void;
    onSelect: (course: CourseWithGrade) => void;
    selectedCourseId: string | null;
}


// ====================================================
// ====================================================
const OfferedCoursesTable: React.FC<OfferedCoursesTableProps> = ({
    offeredCourses,
    loading,
    error,
    page,
    limit,
    totalRows,
    setPage,
    onSelect,
    selectedCourseId,
}) => {

    if (error) return (
        <Alert
            title={error}
            type="error"
            showIcon
            style={{ margin: '16px 0', fontSize: '14px' }}
        />
    );

    console.log(`/offeredCoursesTable\nlimit: ${limit}, page: ${page}, totalRows: ${totalRows}\nCourses:${JSON.stringify(offeredCourses, null, 0)}`);

    // ---------------------------------------------------------------------------------------
    return (
        <ReusableSelectTable<CourseWithGrade>
            data={offeredCourses}
            columns={columns}
            loading={loading}
            rowKey="id"
            onSelect={onSelect}
            emptyText="No Courses Available"
            selectedRowKeys={selectedCourseId ? [selectedCourseId] : []}
            pagination={{
                current: page,
                total: totalRows,
                pageSize: limit,
                onChange: (newPage) => setPage(newPage)
            }}

        />
    );
};

export default OfferedCoursesTable;
