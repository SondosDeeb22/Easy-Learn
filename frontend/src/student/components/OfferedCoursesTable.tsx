import { useState } from 'react';
import { TableColumnsType } from 'antd';

// hooks
import { useOfferedCourses } from '../hooks/offeredCoursesHook';

// interface
import { OfferedCourses } from '../interfaces/courses.interface';

// reusable component
import ReusableSelectTable from '../../shared/components/ReusableSelectTable';

// ====================================================
const columns: TableColumnsType<OfferedCourses> = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Credit', dataIndex: 'credit', key: 'credit' },
];

interface OfferedCoursesTableProps {
    data?: OfferedCourses[]
    onSelect: (course: OfferedCourses) => void;
}
// ====================================================
const OfferedCoursesTable: React.FC<OfferedCoursesTableProps> = ({ data: externalData, onSelect }) => {
    const { data, loading, error } = useOfferedCourses();
    const [selectedCourse, setSelectedCourse] = useState<OfferedCourses | null>(null);

    if (error) return <div>{error}</div>

    const courses = externalData ?? data ?? [];

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
        />
    );
};

export default OfferedCoursesTable;
