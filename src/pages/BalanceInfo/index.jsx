import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Typography } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import { chatAPI } from '../../services/api';
import './style.css';

const { Title } = Typography;

const BalanceInfo = () => {
  const [balance, setBalance] = useState({total_balance:0,granted_balance:0,topped_up_balance:0})
  useEffect(() => {
     chatAPI.searchBalance().then(res => {
      const { granted_balance,topped_up_balance,total_balance } = res.data.balance_infos[0]
      setBalance({ granted_balance,topped_up_balance,total_balance })
     })

  }, [])
  return (
    <Card className="balance-card">
      <Title level={3} className="balance-title">
        <WalletOutlined /> 账户余额
      </Title>
      <Row gutter={16}>
        <Col span={24}>
          <Card bordered={false}>
            <Statistic
              title="当前可用余额"
              value={balance.total_balance}
              precision={2}
              suffix="元"
              valueStyle={{ color: '#3f8600', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={24} style={{ margin: '10px 0' }}>
          <Card bordered={false}>
            <Statistic
              title="未过期余额"
              value={balance.granted_balance}
              precision={2}
              suffix="元"
              valueStyle={{ color: '#3f8600', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card bordered={false}>
            <Statistic
              title="已充值余额"
              value={balance.topped_up_balance}
              precision={2}
              suffix="元"
              valueStyle={{ color: '#3f8600', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default BalanceInfo; 