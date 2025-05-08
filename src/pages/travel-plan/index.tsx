import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Typography, Button, Row, Col, Tabs, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useTravelPlanModel from '@/models/travelPlan';
import TravelPlanForm from './components/TravelPlanForm';
import TravelPlanDetail from './components/TravelPlanDetail';
import styles from './index.less';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const TravelPlanPage: React.FC = () => {
  const {
    travelPlans,
    currentPlan,
    setCurrentPlan,
    createTravelPlan,
    deleteTravelPlan
  } = useTravelPlanModel();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleCreatePlan = (name: string) => {
    if (!name.trim()) {
      message.error('Vui lòng nhập tên kế hoạch!');
      return;
    }
    createTravelPlan(name);
    setIsModalVisible(false);
    message.success('Tạo kế hoạch thành công!');
  };

  const handleDeletePlan = (id: string) => {
    deleteTravelPlan(id);
    message.success('Xoá kế hoạch thành công!');
  };

  const handleTabChange = (activeKey: string) => {
    const plan = travelPlans.find(p => p.id === activeKey);
    if (plan) {
      setCurrentPlan(plan);
    }
  };

  return (
    <PageContainer
      title="Lập kế hoạch du lịch"
      className={styles.container}
    >
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4}>Quản lý kế hoạch du lịch</Title>
              <Text type="secondary">
                Thêm, sửa, xoá các kế hoạch du lịch và quản lý chi tiết lịch trình
              </Text>
            </Col>
            <Col>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Tạo kế hoạch mới
              </Button>
            </Col>
          </Row>

          <TravelPlanForm
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onSubmit={handleCreatePlan}
          />
          
          {travelPlans.length > 0 ? (
            <Tabs
              activeKey={currentPlan?.id}
              onChange={handleTabChange}
              type="card"
              tabPosition="top"
              className={styles.tabs}
            >
              {travelPlans.map(plan => (
                <TabPane 
                  tab={plan.name} 
                  key={plan.id}
                  closable={travelPlans.length > 1}
                  closeIcon={<Button 
                    type="text" 
                    size="small" 
                    danger
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlan(plan.id);
                    }}
                  >
                    X
                  </Button>}
                >
                  <TravelPlanDetail plan={plan} />
                </TabPane>
              ))}
            </Tabs>
          ) : (
            <Card className={styles.emptyCard}>
              <Space direction="vertical" align="center">
                <Text type="secondary">Chưa có kế hoạch du lịch nào</Text>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setIsModalVisible(true)}
                >
                  Tạo kế hoạch mới
                </Button>
              </Space>
            </Card>
          )}
        </Space>
      </Card>
    </PageContainer>
  );
};

export default TravelPlanPage; 