import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Spin } from 'antd';
import { chatAPI } from '../../services/api';
import './style.css';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const VideoPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const [scriptContent, setScriptContent] = useState('');
  const [taskId, setTaskId] = useState('');
  const navigate = useNavigate();

  // 处理表单提交
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setScriptContent('');
      // 首先调用sendMessage接口
      const response = await chatAPI.sendMessage({
        message: [{ role: "user", content: values.prompt }],
        id: localStorage.getItem('userId'),
        newChat: true
      });

      // 处理流式响应
      const reader = response.data.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content === '[DONE]') break;
              accumulatedContent += data.content;
              setScriptContent(accumulatedContent);
            } catch (e) {
              console.log('Parse error:', e);
            }
          }
        }
      }

      // 开始生成视频
      setGenerating(true);
      message.info('视频订单生产中，请稍候...');

      try {
        const videoResponse = await chatAPI.sendVideoMessage({
          message: accumulatedContent,
          id: localStorage.getItem('userId'),
          request_id: `VID_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          model: 'video-gen-v1'
        });

        if (videoResponse.data) {
          setTaskId(videoResponse.data.id);
          message.success('视频生成任务已提交，请稍后查看结果');
        } else {
          throw new Error('视频生成任务提交失败');
        }
      } catch (error) {
        message.error('视频生成失败，请重试');
        console.log('Video generation error:', error);
      }

    } catch (error) {
      message.error('操作失败，请重试');
      console.log('Operation error:', error);
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <Card 
          title="AI视频生成" 
          extra={
            <Button onClick={() => navigate('/ai/tasks')}>
              查看任务列表
            </Button>
          }
          className="main-card"
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Form.Item
              name="prompt"
              label="请输入视频生成提示词"
              rules={[{ required: true, message: '请输入提示词' }]}
            >
              <TextArea
                rows={4}
                placeholder="请详细描述您想要生成的视频内容..."
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading || generating}
              >
                {loading ? '文案生成中...' : generating ? '生成视频中...' : '生成视频'}
              </Button>
            </Form.Item>
          </Form>

          {loading && <Spin tip="正在处理..." />}

          {scriptContent && (
            <Card
              title="生成的文案"
              className="script-card"
              style={{ marginTop: '20px' }}
            >
              <pre className="script-content">{scriptContent}</pre>
            </Card>
          )}

          {videoUrl && (
            <Card
              title="生成的视频"
              className="video-card"
              style={{ marginTop: '20px' }}
            >
              <video
                controls
                className="video-player"
                src={videoUrl}
                poster="video-thumbnail.jpg"
              >
                您的浏览器不支持视频播放
              </video>
              <div className="video-url" style={{ marginTop: '16px' }}>
                <Input 
                  value={videoUrl} 
                  readOnly 
                  addonAfter={
                    <Button 
                      type="link" 
                      onClick={() => {
                        navigator.clipboard.writeText(videoUrl);
                        message.success('链接已复制');
                      }}
                    >
                      复制
                    </Button>
                  }
                />
              </div>
            </Card>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VideoPage; 