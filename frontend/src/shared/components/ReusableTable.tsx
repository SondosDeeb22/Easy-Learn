import { Table, TableColumnsType, Divider, ConfigProvider } from 'antd';
import { colors } from '../../styles/colorPalette';

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
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy, colorPrimaryBg: '#ecececff', colorPrimaryBgHover: "#ececec" } }}>
            <Divider />
            <Table<T>
                dataSource={data}
                columns={columns}
                rowKey={rowKey}
                loading={loading}
                pagination={data.length > 10 ? { pageSize: 10, position: ['bottomCenter'] } : false}
            />
        </ConfigProvider>
    );
}

export default ReusableTable;