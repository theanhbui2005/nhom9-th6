import { useState } from "react";
import type { Destination } from "@/services/Destination/typing";

// Dữ liệu mẫu mặc định
const defaultDestinations: Destination[] = [
  {
    id: "1",
    name: "Vịnh Hạ Long",
    image: "https://www.chudu24.com/wp-content/uploads/2018/06/H%E1%BA%A1.Long_.Bay_.original.1986.jpg",
    location: "Quảng Ninh",
    rating: 3.5,
    price: 1500000,
    category: "biển",
    description: "Vịnh Hạ Long là một trong những kỳ quan thiên nhiên thế giới, nổi tiếng với hàng nghìn hòn đảo đá vôi và cảnh quan tuyệt đẹp.",
    visitTime: "3 ngày 2 đêm",
    foodCost: 500000,
    accommodationCost: 700000,
    transportCost: 300000,
    imageUrl: "https://example.com/halong.jpg",
  },
  {
    id: "2",
    name: "Sapa",
    image: "https://tse1.mm.bing.net/th/id/OIP.sZ2K_noBnWImkf-A5ufXygHaFg?cb=iwp1&rs=1&pid=ImgDetMain",
    location: "Lào Cai",
    rating: 4.7,
    price: 1800000,
    category: "núi",
    description: "Sapa là một thị trấn miền núi nổi tiếng với cảnh đẹp hùng vĩ, những thửa ruộng bậc thang và văn hóa đa dạng của các dân tộc thiểu số.",
    visitTime: "2 ngày 1 đêm",
    foodCost: 400000,
    accommodationCost: 800000,
    transportCost: 600000,
    imageUrl: "https://example.com/sapa.jpg",
  },
  {
    id: "3",
    name: "Đà Nẵng City Tour",
    image: "https://tse3.mm.bing.net/th/id/OIP.LTXI-7En9h3DZ_L4QMIdKQHaEV?cb=iwp1&rs=1&pid=ImgDetMain",
    location: "Đà Nẵng",
    rating: 2.2,
    price: 1200000,
    category: "thành phố",
    description: "Đà Nẵng là một thành phố ven biển nổi tiếng với bãi biển Mỹ Khê, cầu Rồng và các điểm tham quan văn hóa độc đáo.",
    visitTime: "1 ngày",
    foodCost: 300000,
    accommodationCost: 500000,
    transportCost: 400000,
    imageUrl: "https://example.com/danang.jpg",
  },
];

const useDestinationModel = () => {
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const stored = localStorage.getItem("destinations");
    return stored ? JSON.parse(stored) : defaultDestinations;
  });

  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  const saveToStorage = (data: Destination[]) => {
    localStorage.setItem("destinations", JSON.stringify(data));
  };

  const addDestination = (destination: Omit<Destination, "id">) => {
    const newDestination: Destination = {
      id: Date.now().toString(),
      ...destination,
    };
    const newList = [...destinations, newDestination];
    saveToStorage(newList);
    setDestinations(newList);
  };

  const updateDestination = (updated: Destination) => {
    const newList = destinations.map((item) =>
      item.id === updated.id ? updated : item
    );
    saveToStorage(newList);
    setDestinations(newList);
  };

  const deleteDestination = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xoá điểm đến này?")) {
      const newList = destinations.filter((item) => item.id !== id);
      saveToStorage(newList);
      setDestinations(newList);
    }
  };

  const filterByCategory = (category: Destination["category"]) =>
    destinations.filter((d) => d.category === category);

  const sortByPrice = (ascending = true) =>
    [...destinations].sort((a, b) =>
      ascending ? a.price - b.price : b.price - a.price
    );

  const sortByRating = (descending = true) =>
    [...destinations].sort((a, b) =>
      descending ? b.rating - a.rating : a.rating - b.rating
    );

  //  khôi phục dữ liệu về mặc định
  const resetData = () => {
    saveToStorage(defaultDestinations);
    setDestinations(defaultDestinations);
  };

  return {
    destinations,
    setDestinations,
    visible,
    setVisible,
    isEdit,
    setIsEdit,
    selectedDestination,
    setSelectedDestination,
    addDestination,
    updateDestination,
    deleteDestination,
    filterByCategory,
    sortByPrice,
    sortByRating,
    resetData, // tuỳ chọn
  };
};

export default useDestinationModel;

