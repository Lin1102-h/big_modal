import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Button, Space, message } from 'antd';
import { chatAPI } from '../../services/api';
import { formatDate } from '../../utils/dateUtils';

const VideoTaskList = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchTasks = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await chatAPI.getUserVideoTasks(
        localStorage.getItem('userId'),
        page,
        pageSize
      );

      if (response.data) {
        setTasks(response.data.tasks);
        setPagination({
          current: page,
          pageSize: pageSize,
          total: response.data.total
        });
      }
    } catch (error) {
      message.error('获取任务列表失败');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTableChange = (pagination) => {
    fetchTasks(pagination.current, pagination.pageSize);
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      PENDING: { color: 'gold', text: '等待处理' },
      PROCESSING: { color: 'blue', text: '处理中' },
      COMPLETED: { color: 'green', text: '已完成' },
      FAILED: { color: 'red', text: '失败' }
    };

    const config = statusConfig[status] || { color: 'default', text: '未知状态' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: '任务ID',
      dataIndex: 'id',
      key: 'id',
      width: 220,
    },
    {
      title: '请求ID',
      dataIndex: 'request_id',
      key: 'request_id',
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'task_status',
      key: 'task_status',
      width: 100,
      render: (status) => getStatusTag(status)
    },
    {
      title: '模型',
      dataIndex: 'model',
      key: 'model',
      width: 120,
    },
    {
      title: '提示词',
      dataIndex: 'prompt_text',
      key: 'prompt_text',
      width: 200,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date) => formatDate(date)
    },
    {
      title: '完成时间',
      dataIndex: 'completion_time',
      key: 'completion_time',
      width: 180,
      render: (date) => date ? formatDate(date) : '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          {record.video_url && (
            <Button 
              type="link" 
              onClick={() => window.open(record.video_url, '_blank')}
            >
              查看视频
            </Button>
          )}
          <Button 
            type="link" 
            onClick={() => fetchTasks(pagination.current, pagination.pageSize)}
          >
            刷新状态
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-content">
        <Card 
          title="视频生成任务列表" 
          extra={
            <Button type="primary" onClick={() => fetchTasks()}>
              刷新列表
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: 1300 }}
          />
        </Card>
      </div>
    </div>
  );
};

export default VideoTaskList; 