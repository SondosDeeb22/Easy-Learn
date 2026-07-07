import { useState } from 'react';
import { Card, Typography, Tag, Divider, Alert, Space, Button, ConfigProvider } from 'antd';
import { InfoCircleOutlined, CloseOutlined } from '@ant-design/icons';

import { colors } from '../../styles/colorPalette';
const { Text } = Typography;
import { CopyOutlined } from '@ant-design/icons';
// ============================================================================
export default function DemoCredentialsCard() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <ConfigProvider theme={{ token: { colorPrimary: "white" } }}>

        <Button
          type="primary"
          shape="circle"
          icon={<InfoCircleOutlined />}
          size="large"
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
            color: colors.burgundy,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        />
      </ConfigProvider>
    );
  }

  // --------------------
  return (
    <ConfigProvider theme={{ token: { colorPrimary: colors.burgundy } }}>

      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
      }}>

        <Card
          size="small"
          title={
            <Space>
              <InfoCircleOutlined style={{ color: '#551229ff' }} />
              <Text strong>Demo Credentials</Text>
            </Space>
          }
          extra={
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setOpen(false)}
              size="small"
            />
          }
          style={{
            width: 320,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            borderColor: '#f0f0f0'
          }}
          styles={{ header: { borderBottom: '1px solid #f0f0f0', padding: '12px 16px' }, body: { padding: '16px' } }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Admin Section */}
            <div>
              <div style={{ marginBottom: '8px' }}>
                <Tag color={colors.burgundy}>Admin</Tag>
              </div>
              <Space direction="vertical" size={2} style={{ width: '100%', paddingLeft: '4px' }}>
                <Space>
                  <Text type="secondary">ID:</Text>
                  <Text copyable={{ icon: [<CopyOutlined style={{ color: colors.burgundy }} />] }} style={{ fontFamily: 'monospace' }}>10001234</Text>
                </Space>
                <Space>
                  <Text type="secondary">Password:</Text>
                  <Text copyable={{ icon: [<CopyOutlined style={{ color: colors.burgundy }} />] }} style={{ fontFamily: 'monospace' }}>123</Text>
                </Space>
              </Space>
            </div>


            {/* Student Section */}
            <div>
              <div style={{ marginBottom: '8px' }}>
                <Tag color={colors.burgundy}>Student</Tag>
              </div>
              <Space direction="vertical" size={2} style={{ width: '100%', paddingLeft: '4px' }}>
                <Space>
                  <Text type="secondary">ID:</Text>
                  <Text copyable={{ icon: [<CopyOutlined style={{ color: colors.burgundy }} />] }} style={{ fontFamily: 'monospace' }}>20261111</Text>
                </Space>
                <Space>
                  <Text type="secondary">Password:</Text>
                  <Text copyable={{ icon: [<CopyOutlined style={{ color: colors.burgundy }} />] }} style={{ fontFamily: 'monospace' }}>123</Text>
                </Space>
              </Space>
            </div>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
}
