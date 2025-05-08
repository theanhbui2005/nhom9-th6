import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Tabs, 
  Row, 
  Col, 
  DatePicker, 
  Modal, 
  Form, 
  Select, 
  TimePicker,
  List,
  Tag,
  Space,
  Divider,
  Tooltip,
  Empty,
  Statistic
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  OrderedListOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import type { TravelPlan, DayPlan } from '@/services/TravelPlan/typing';
import type { Destination } from '@/services/Destination/typing';
import useTravelPlanModel from '@/models/travelPlan';
import useDestinationModel from '@/models/destination';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface TravelPlanDetailProps {
  plan: TravelPlan;
}

const TravelPlanDetail: React.FC<TravelPlanDetailProps> = ({ plan }) => {
  const { 
    destinations: allDestinations 
  } = useDestinationModel();
  
  const {
    addDayToPlan,
    removeDayFromPlan,
    addDestinationToDay,
    removeDestinationFromDay,
    reorderDestinations,
    findDestinationById
  } = useTravelPlanModel();

  const [activeTabKey, setActiveTabKey] = useState<string>(
    plan.days.length > 0 ? plan.days[0].date : ''
  );
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isAddDateVisible, setIsAddDateVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  // Xử lý thêm ngày mới
  const handleAddDate = (date: moment.Moment) => {
    const dateString = date.format('YYYY-MM-DD');
    addDayToPlan(plan.id, dateString);
    setIsAddDateVisible(false);
    setActiveTabKey(dateString);
  };

  // Xử lý xoá ngày
  const handleRemoveDate = (date: string) => {
    Modal.confirm({
      title: 'Xác nhận xoá',
      content: 'Bạn có chắc muốn xoá ngày này và tất cả điểm đến trong ngày?',
      onOk: () => {
        removeDayFromPlan(plan.id, date);
        
        // Chuyển sang tab khác nếu xoá tab đang active
        if (activeTabKey === date && plan.days.length > 1) {
          const nextActiveDay = plan.days.find(day => day.date !== date);
          if (nextActiveDay) {
            setActiveTabKey(nextActiveDay.date);
          }
        }
      }
    });
  };

  // Xử lý thêm điểm đến vào ngày
  const handleAddDestination = () => {
    form.validateFields().then(values => {
      const { destinationId, startTime, endTime } = values;
      addDestinationToDay(
        plan.id,
        activeTabKey,
        destinationId,
        startTime.format('HH:mm'),
        endTime.format('HH:mm')
      );
      form.resetFields();
      setIsAddModalVisible(false);
    });
  };

  // Xử lý xoá điểm đến khỏi ngày
  const handleRemoveDestination = (order: number) => {
    removeDestinationFromDay(plan.id, activeTabKey, order);
  };

  // Xử lý kéo thả để sắp xếp lại
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const day = plan.days.find(d => d.date === activeTabKey);
    if (!day) return;
    
    // Lấy danh sách order hiện tại
    const currentOrders = day.destinations.map(d => d.order);
    
    // Sắp xếp lại
    const [reorderedItem] = currentOrders.splice(result.source.index, 1);
    currentOrders.splice(result.destination.index, 0, reorderedItem);
    
    // Cập nhật
    reorderDestinations(plan.id, activeTabKey, currentOrders);
  };

  // Hiển thị thời gian di chuyển giữa các điểm đến
  const renderTravelTime = (travelDuration: number | undefined) => {
    if (!travelDuration) return null;
    
    const hours = Math.floor(travelDuration / 60);
    const minutes = travelDuration % 60;
    
    return (
      <div style={{ marginBottom: 8 }}>
        <ArrowRightOutlined style={{ marginRight: 8, color: '#1890ff' }} />
        <Text type="secondary">
          Di chuyển: {hours > 0 ? `${hours} giờ ` : ''}{minutes > 0 ? `${minutes} phút` : ''}
        </Text>
      </div>
    );
  };

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format thời gian
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} giờ ${mins} phút`;
  };

  // Render nội dung của tab theo ngày
  const renderDayContent = (day: DayPlan) => {
    return (
      <Card bordered={false}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={`day-${day.date}`}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {day.destinations.length > 0 ? (
                  <List
                    itemLayout="vertical"
                    dataSource={day.destinations.sort((a, b) => a.order - b.order)}
                    renderItem={(item, index) => {
                      const destination = findDestinationById(item.destinationId);
                      
                      if (!destination) return null;
                      
                      return (
                        <Draggable 
                          key={`dest-${item.order}`} 
                          draggableId={`dest-${item.order}`} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {item.travelDuration ? renderTravelTime(item.travelDuration) : null}
                              <List.Item
                                key={item.order}
                                style={{ 
                                  border: '1px solid #f0f0f0', 
                                  borderRadius: 4, 
                                  padding: 16, 
                                  marginBottom: 16 
                                }}
                                actions={[
                                  <Tooltip title="Xoá điểm đến" key="delete">
                                    <Button 
                                      icon={<DeleteOutlined />} 
                                      type="text" 
                                      danger
                                      onClick={() => handleRemoveDestination(item.order)}
                                    />
                                  </Tooltip>,
                                ]}
                                extra={
                                  <img
                                    width={200}
                                    alt={destination.name}
                                    src={destination.image}
                                    style={{ borderRadius: 4 }}
                                  />
                                }
                              >
                                <List.Item.Meta
                                  title={
                                    <Space align="center">
                                      <OrderedListOutlined /> 
                                      <span>{item.order}.</span>
                                      <span>{destination.name}</span>
                                      <Tag color="blue">{destination.category}</Tag>
                                    </Space>
                                  }
                                  description={
                                    <Space direction="vertical">
                                      <Space>
                                        <EnvironmentOutlined />
                                        <Text>{destination.location}</Text>
                                      </Space>
                                      <Space>
                                        <ClockCircleOutlined />
                                        <Text>{item.startTime} - {item.endTime}</Text>
                                      </Space>
                                      <Space>
                                        <DollarOutlined />
                                        <Text>{formatCurrency(destination.price)}</Text>
                                      </Space>
                                    </Space>
                                  }
                                />
                              </List.Item>
                            </div>
                          )}
                        </Draggable>
                      );
                    }}
                  />
                ) : (
                  <Empty 
                    description="Chưa có điểm đến nào cho ngày này" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        <Button 
          type="dashed" 
          block
          icon={<PlusOutlined />}
          onClick={() => {
            setActiveTabKey(day.date);
            setIsAddModalVisible(true);
          }}
        >
          Thêm điểm đến
        </Button>
      </Card>
    );
  };

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Statistic
              title="Tổng chi phí du lịch"
              value={plan.totalBudget}
              precision={0}
              formatter={(value) => formatCurrency(value as number)}
              prefix={<DollarOutlined />}
            />
          </Col>
          <Col xs={24} md={8}>
            <Statistic
              title="Tổng thời gian"
              value={formatDuration(plan.totalDuration)}
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col xs={24} md={8}>
            <Statistic
              title="Số ngày du lịch"
              value={plan.days.length}
              prefix={<EnvironmentOutlined />}
            />
          </Col>
        </Row>
      </Card>

      <Divider />

      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={5}>Lịch trình du lịch</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsAddDateVisible(true)}
          >
            Thêm ngày
          </Button>
        </Col>
      </Row>

      {plan.days.length > 0 ? (
        <Tabs
          activeKey={activeTabKey}
          onChange={setActiveTabKey}
          type="card"
          size="large"
          tabPosition="top"
          tabBarExtraContent={
            plan.days.length > 1 ? (
              <Button 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveDate(activeTabKey)}
              >
                Xoá ngày này
              </Button>
            ) : null
          }
        >
          {plan.days.map(day => (
            <TabPane
              tab={moment(day.date).format('DD/MM/YYYY')}
              key={day.date}
            >
              {renderDayContent(day)}
            </TabPane>
          ))}
        </Tabs>
      ) : (
        <Empty description="Chưa có ngày nào trong kế hoạch" />
      )}

      {/* Modal thêm ngày */}
      <Modal
        title="Thêm ngày vào kế hoạch"
        visible={isAddDateVisible}
        onCancel={() => setIsAddDateVisible(false)}
        footer={null}
      >
        <DatePicker
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          disabledDate={(current) => {
            // Không cho phép chọn ngày đã tồn tại trong kế hoạch
            const dates = plan.days.map(d => d.date);
            return current && dates.includes(current.format('YYYY-MM-DD'));
          }}
          onChange={handleAddDate}
        />
      </Modal>

      {/* Modal thêm điểm đến */}
      <Modal
        title="Thêm điểm đến vào lịch trình"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAddDestination}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="destinationId"
            label="Chọn điểm đến"
            rules={[{ required: true, message: 'Vui lòng chọn điểm đến' }]}
          >
            <Select placeholder="Chọn điểm đến">
              {allDestinations.map(dest => (
                <Option key={dest.id} value={dest.id}>
                  <Space>
                    <span>{dest.name}</span>
                    <Tag color="blue">{dest.category}</Tag>
                    <Text type="secondary">- {dest.location}</Text>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="Thời gian bắt đầu"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
              >
                <TimePicker
                  format="HH:mm"
                  minuteStep={15}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label="Thời gian kết thúc"
                rules={[
                  { required: true, message: 'Vui lòng chọn thời gian kết thúc' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || !getFieldValue('startTime')) {
                        return Promise.resolve();
                      }
                      if (value.isAfter(getFieldValue('startTime'))) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Thời gian kết thúc phải sau thời gian bắt đầu'));
                    },
                  }),
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  minuteStep={15}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default TravelPlanDetail; 