import React from 'react';
import { ConfigProvider, Divider, Radio, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { colors } from '../../styles/colorPalette';
// ====================================================================

interface ReusableSelectTableInterface<T> {
    data: T[];
    columns: TableColumnsType<T>;
    loading?: boolean;
    rowKey: keyof T & string;
    onSelect?: (selectedRow: T) => void; //callback when row is selected
}
// ====================================================================



function ReusableSelectTable<T extends object>({ data, columns, loading, rowKey, onSelect }: ReusableSelectTableInterface<T>) {
    // rowSelection object indicates the need for row selection
    const rowSelection: TableProps<T>['rowSelection'] = {
        onChange: (_: React.Key[], selectedRows: T[]) => {
            onSelect?.(selectedRows[0]);  // get the course data of selected row
        },

    };
    // -----------------------------------------------------------------------------------------

    return (
        <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy, colorPrimaryBg: '#ecececff', colorPrimaryBgHover: "#ececec" } }}>

            <Divider />
            <Table<T>
                rowKey={rowKey}
                loading={loading}
                rowSelection={{ type: "radio", ...rowSelection }}
                columns={columns}
                dataSource={data}
                pagination={data.length > 10 ? { pageSize: 10, position: ['bottomCenter'] } : false}
            />
        </ConfigProvider>
    );
};

// ====================================================================

export default ReusableSelectTable;