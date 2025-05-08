import React, { useEffect, useState } from "react";
import { Rate } from "antd";

import { Card, Col, Row, Button, Modal, Input } from "antd";
import { useModel } from "umi"; // Giả sử bạn đang sử dụng umi để quản lý trạng thái
import { Destination } from "@/services/Destination/typing";  // Đảm bảo đã import đúng từ file model

const { Meta } = Card;

const DestinationIndex = () => {
  const {
    destinations,
    filterByCategory,
    sortByPrice,
    sortByRating,
    setVisible,
    setSelectedDestination,
    deleteDestination,
  } = useModel('destination')

  const [searchText, setSearchText] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>(destinations);

  useEffect(() => {
    setFilteredDestinations(destinations);
  }, [destinations]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleFilterCategory = (category: string) => {
    setFilteredDestinations(filterByCategory(category));
  };

  const handleSortByPrice = (ascending: boolean) => {
    setFilteredDestinations(sortByPrice(ascending));
  };

  const handleSortByRating = (descending: boolean) => {
    setFilteredDestinations(sortByRating(descending));
  };

  const handleCardClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setVisible(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    deleteDestination(id);
  };

  const filteredAndSearchedDestinations = filteredDestinations.filter(destination =>
    destination.name.toLowerCase().includes(searchText.toLowerCase()) ||
    destination.location.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      {/* Các nút lọc và sắp xếp */}
      <div style={{ marginBottom: 20 }}>
        <Button onClick={() => handleFilterCategory('biển')}>Biển</Button>
        <Button onClick={() => handleFilterCategory('núi')}>Núi</Button>
        <Button onClick={() => handleFilterCategory('thành phố')}>Thành phố</Button>
        <Button onClick={() => handleSortByPrice(true)}>Giá tăng dần</Button>
        <Button onClick={() => handleSortByPrice(false)}>Giá giảm dần</Button>
        <Button onClick={() => handleSortByRating(true)}>Đánh giá cao</Button>
        <Button onClick={() => handleSortByRating(false)}>Đánh giá thấp</Button>
      </div>

      {/* Tìm kiếm */}
      <Input.Search
        placeholder="Tìm kiếm điểm đến"
        onChange={handleSearch}
        value={searchText}
        style={{ marginBottom: 16, width: 300 }}
      />

      {/* Hiển thị các điểm đến dưới dạng các Card */}
      <Row gutter={16}>
        {filteredAndSearchedDestinations.map((destination) => (
          <Col span={8} key={destination.id}>
            <Card
              hoverable
              cover={<img alt={destination.name} src={destination.image} />}
              onClick={() => handleCardClick(destination)} // Khi click vào card
              actions={[
                <Button
                  type="danger"
                  onClick={(e) => handleDelete(destination.id, e)} // Xử lý xóa
                >
                  Xóa
                </Button>,
              ]}
            >
              <Meta title={destination.name} description={destination.location} />
              {/* Hiển thị rating */}
              <div style={{ marginTop: 8 }}>
                <Rate disabled value={destination.rating} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal hiển thị chi tiết điểm đến khi click vào card */}
      {/* <Modal
        title={selectedDestination?.name}
        visible={selectedDestination !== null} // Nếu có điểm đến đã chọn, modal sẽ hiện
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <p>Địa điểm: {selectedDestination?.location}</p>
        <p>Giá: {selectedDestination?.price}</p>
        <p>Danh mục: {selectedDestination?.category}</p>
      </Modal> */}
    </div>
  );
};

export default DestinationIndex;
