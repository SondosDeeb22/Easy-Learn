import { useState } from 'react';
import { TableColumnsType, Alert } from 'antd';

// hooks
import { useOfferedCourses } from '../hooks/offeredCoursesHook';

// interface
import { OfferedCourses, OfferedCoursesWithCredits } from '../interfaces/courses.interface';

// reusable component
import ReusableSelectTable from '../../shared/components/ReusableSelectTable';

// ====================================================
const columns: TableColumnsType<OfferedCourses> = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Credit', dataIndex: 'credit', key: 'credit' },
];

interface OfferedCoursesTableProps {
    data?: OfferedCoursesWithCredits
    onSelect: (course: OfferedCourses) => void;
}
// ====================================================
const OfferedCoursesTable: React.FC<OfferedCoursesTableProps> = ({ data: externalData, onSelect }) => {
    const { data, loading, error } = useOfferedCourses();
    const [selectedCourse, setSelectedCourse] = useState<OfferedCourses | null>(null);

    if (error) return (
        <Alert
            message={error}
            type="error"
            showIcon
            style={{ margin: '16px 0', fontSize: '14px' }}
        />
    );

    const courses = externalData?.courses ?? data?.courses ?? [];
    console.log("courses from table: \n", courses);

    return (
        <ReusableSelectTable<OfferedCourses>
            data={courses}
            columns={columns}
            loading={loading}
            rowKey="code"
            onSelect={(course) => {
                onSelect(course);
                setSelectedCourse(course)
            }}
            emptyText="No Courses Available"
        />
    );
};

export default OfferedCoursesTable;
