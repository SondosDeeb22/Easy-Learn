import React from 'react';
import { ConfigProvider, Divider, Radio, Table, Empty } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { colors } from '../../styles/colorPalette';
// ====================================================================

interface ReusableSelectTableInterface<T> {
    data: T[];
    columns: TableColumnsType<T>;
    loading?: boolean;
    rowKey: keyof T & string;
    onSelect?: (selectedRow: T) => void; //callback when row is selected
    emptyText?: string;
}
// ====================================================================



function ReusableSelectTable<T extends object>({ data, columns, loading, rowKey, onSelect, emptyText }: ReusableSelectTableInterface<T>) {
    // rowSelection object indicates the need for row selection
    const rowSelection: TableProps<T>['rowSelection'] = {
        onChange: (_: React.Key[], selectedRows: T[]) => {
            onSelect?.(selectedRows[0]);  // get the course data of selected row
        },

    };
    // -----------------------------------------------------------------------------------------

    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy, colorPrimaryBg: colors.bgPrimary, colorPrimaryBgHover: colors.bgHover } }}>

            <Divider />
            <Table<T>
                rowKey={rowKey}
                loading={loading}
                rowSelection={{ type: "radio", ...rowSelection }}
                columns={columns}
                dataSource={data}
                locale={{ emptyText: <Empty description={emptyText ?? 'No Data'} image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                pagination={data.length > 10 ? { pageSize: 10, position: ['bottomCenter'] } : false}
            />
        </ConfigProvider>
    );
};

// ====================================================================

export default ReusableSelectTable;