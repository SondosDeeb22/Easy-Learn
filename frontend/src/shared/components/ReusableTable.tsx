import { Table, TableColumnsType, Divider, ConfigProvider, Empty } from 'antd';
import { colors } from '../../styles/colorPalette';

// ===============================================

interface ReusableTableInterface<T> {
    data: T[];
    columns: TableColumnsType<T>;
    loading?: boolean;
    rowKey: keyof T & string;
    emptyText?: string;

    pagination?: boolean

    page?: number;
    limit?: number;
    total?: number;
    onChange?: (newPage: number) => void;

}

// =======================================================
//? reusable table component
// =======================================================

function ReusableTable<T extends object>({ data, columns, loading, rowKey, emptyText, page, limit, total, onChange }: ReusableTableInterface<T>) {
    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy, colorPrimaryBg: '#ecececff', colorPrimaryBgHover: "#ececec" } }}>
            <Divider />
            <Table<T>
                dataSource={data}
                columns={columns}
                rowKey={rowKey}
                loading={loading}
                locale={{ emptyText: <Empty description={emptyText ?? 'No Data'} image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                // pagination={data.length > 8 ? { pageSize: 8, position: ['bottomCenter'] } : false}
                pagination={{
                    current: page,
                    pageSize: limit,
                    total: total,
                    onChange: onChange,
                    position: ['bottomCenter'],
                }}

            />
        </ConfigProvider>
    );
}

export default ReusableTable;