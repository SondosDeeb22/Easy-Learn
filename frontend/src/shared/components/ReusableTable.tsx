import { Table, TableColumnsType } from 'antd';

// ===============================================

interface ReusableTableInterface<T> {
    data: T[];
    columns: TableColumnsType<T>;
    loading?: boolean;
    rowKey: keyof T & string;
}

// =======================================================
//? reusable table component
// =======================================================

function ReusableTable<T extends object>({ data, columns, loading, rowKey }: ReusableTableInterface<T>) {
    return (
        <Table<T>
            dataSource={data}
            columns={columns}
            rowKey={rowKey}
            loading={loading}
            pagination={data.length > 10 ? { pageSize: 10 } : false}
        />
    );
}

export default ReusableTable;