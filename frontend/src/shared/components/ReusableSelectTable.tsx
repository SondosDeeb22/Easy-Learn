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
    selectedRowKeys?: React.Key[]; // Controlled selection keys

    // Pagination can be a simple boolean (default) or an object with settings
    pagination?: {
        current?: number;
        pageSize?: number;
        total?: number;
        onChange?: (page: number, pageSize: number) => void;
        showSizeChanger?: boolean;
    };
}
// ====================================================================



function ReusableSelectTable<T extends object>({ data, columns, loading, rowKey, onSelect, emptyText, pagination, selectedRowKeys }: ReusableSelectTableInterface<T>) {
    // rowSelection object indicates the need for row selection
    const rowSelection: TableProps<T>['rowSelection'] = {
        selectedRowKeys,
        onChange: (_: React.Key[], selectedRows: T[]) => {
            onSelect?.(selectedRows[0]);  // get the course data of selected row
        },

    };
    // -----------------------------------------------------------------------------------------

    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy, colorPrimaryBg: colors.bgPrimary, colorPrimaryBgHover: colors.bgHover } }}>

            <Divider />
            <Table<T>
                loading={loading}
                rowKey={rowKey}
                rowSelection={{ type: "radio", ...rowSelection }}
                columns={columns}
                dataSource={data}
                locale={{ emptyText: <Empty description={emptyText ?? 'No Data'} image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                style={{ width: '100%' }}
                scroll={{ x: true }}
                pagination={pagination ? {
                    ...pagination,
                    hideOnSinglePage: true,
                    placement: ['bottomCenter'],
                    showSizeChanger: pagination.showSizeChanger ?? false,

                } : false}
            />
        </ConfigProvider>
    );
};

// ====================================================================

export default ReusableSelectTable;