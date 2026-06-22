import { Table, TableColumnsType, Divider, ConfigProvider, Empty } from 'antd';

import { colors } from '../../styles/colorPalette';

// ===============================================

interface ReusableTableInterface<T> {
    data: T[];
    columns: TableColumnsType<T>;
    loading?: boolean;
    rowKey: keyof T & string;
    emptyText?: string;

    // Pagination can be disabled with false or configured with an object
    pagination?: false | {
        current?: number;
        pageSize?: number;
        total?: number;
        onChange?: (page: number, pageSize: number) => void;
    };

}

// =======================================================
//? reusable table component
// =======================================================

function ReusableTable<T extends object>({ data, columns, loading, rowKey, emptyText, pagination }: ReusableTableInterface<T>) {
    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy, colorPrimaryBg: '#ecececff', colorPrimaryBgHover: "#ececec" } }}>
            <Divider />
            <Table<T>
                dataSource={data}
                columns={columns}
                rowKey={rowKey}
                loading={loading}
                locale={{ emptyText: <Empty description={emptyText ?? 'No Data'} image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                style={{ width: '100%' }}
                scroll={{ x: true }}
                // pagination={data.length > 8 ? { pageSize: 8, position: ['bottomCenter'] } : false}
                pagination={pagination ? {
                    ...pagination,
                    hideOnSinglePage: true,
                    placement: ['bottomCenter'],
                } : false}

            />
        </ConfigProvider>
    );
}

export default ReusableTable;