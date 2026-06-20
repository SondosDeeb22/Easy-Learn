import { useState } from 'react';
import { TableColumnsType, Alert } from 'antd';

// interface
import { OfferedCourses } from '../interfaces/courses.interface';

// reusable table component
import ReusableSelectTable from '../../shared/components/ReusableSelectTable';

// ====================================================
const columns: TableColumnsType<OfferedCourses> = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Credit', dataIndex: 'credit', key: 'credit' },
];

interface OfferedCoursesTableProps {
    offeredCourses: OfferedCourses[];
    loading: boolean;
    error?: string;
    page: number;
    limit: number;
    totalRows: number;
    setPage: (page: number) => void;
    onSelect: (course: OfferedCourses) => void;
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
}) => {

    const [selectedCourse, setSelectedCourse] = useState<OfferedCourses | null>(null);

    if (error) return (
        <Alert
            message={error}
            type="error"
            showIcon
            style={{ margin: '16px 0', fontSize: '14px' }}
        />
    );

    console.log(`/offeredCoursesTable\nlimit: ${limit}, page: ${page}, totalRows: ${totalRows}\nCourses:${JSON.stringify(offeredCourses, null, 2)}`);

    // ---------------------------------------------------------------------------------------
    return (
        <ReusableSelectTable<OfferedCourses>
            data={offeredCourses}
            columns={columns}
            loading={loading}
            rowKey="id"
            onSelect={(course) => {
                onSelect(course);
                setSelectedCourse(course)
            }}
            emptyText="No Courses Available"
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
