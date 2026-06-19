import { Table, TableColumnsType, Divider, ConfigProvider, Empty } from 'antd';
import { colors } from '../../styles/colorPalette';

// ===============================================

interface ReusableTableInterface<T> {
    data: T[];
    columns: TableColumnsType<T>;
    loading?: boolean;
    rowKey: keyof T & string;
    emptyText?: string;
}

// =======================================================
//? reusable table component
// =======================================================

function ReusableTable<T extends object>({ data, columns, loading, rowKey, emptyText }: ReusableTableInterface<T>) {
    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy, colorPrimaryBg: '#ecececff', colorPrimaryBgHover: "#ececec" } }}>
            <Divider />
            <Table<T>
                dataSource={data}
                columns={columns}
                rowKey={rowKey}
                loading={loading}
                locale={{ emptyText: <Empty description={emptyText ?? 'No Data'} image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                pagination={data.length > 8 ? { pageSize: 8, position: ['bottomCenter'] } : false}
            />
        </ConfigProvider>
    );
}

export default ReusableTable;