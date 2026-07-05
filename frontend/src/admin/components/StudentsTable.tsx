import React from 'react';
import { TableColumnsType, Alert } from 'antd';

//interface
import { Student } from '../interfaces/users.interface';
// reusable component
import ReusableTable from "../../shared/components/ReusableTable";

// ====================================================

const columns: TableColumnsType<Student> = [
    { title: "Name", dataIndex: "name", key: "name", width: "20%" },
    { title: "ID", dataIndex: "id", key: "id", width: "15%" },
    { title: "Gender", dataIndex: "gender", key: "gender", width: "15%" },
    { title: "Current Semester Credits", dataIndex: "currentSemesterCredits", key: "currentSemesterCredits", width: "15%" },
    { title: "Total Credits", dataIndex: "totalCredits", key: "totalCredits", width: "15%" },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "20%",

        render: (status: string) => {
            let color = 'text-gray-500 bg-gray-100';
            if (status === 'active') color = 'text-green-700 bg-green-50';
            else if (status === 'passive') color = 'text-amber-700 bg-amber-50';
            else if (status === 'graduated') color = 'text-burgundy bg-burgundy/10';

            return (
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${color}`}>
                    {status || 'active'}
                </span>
            );
        }
    },
];

interface Students {
    students: Student[];
    loading: boolean;
    error?: string;
    page: number;
    limit: number;
    totalRows: number;
    setPage: (page: number) => void;
}

// ====================================================

const StudentsTable: React.FC<Students> = ({
    students,
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
    console.log(`/StudentsTable\nlimit: ${limit}, page: ${page}, totalRows: ${totalRows}\nStudents:${JSON.stringify(students, null, 0)}`);

    // =======================================================================================================================

    return (
        <ReusableTable<Student>
            data={students}
            columns={columns}
            loading={loading}
            rowKey="id"
            emptyText="No students found"
            pagination={{
                current: page,
                pageSize: limit,
                total: totalRows,
                onChange: (newPage) => setPage(newPage)
            }}
        />
    );
}

export default StudentsTable;
