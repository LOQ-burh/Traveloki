import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import {
  fetchSanBayPartner,
  deleteSanBay,
  fetchAllSanBay,
} from '../../services/api/ListSanBay/apiDanhSachSanBay.js';
import { Link } from 'react-router-dom';
import { Modal as AntdModal, notification } from 'antd';

const DanhSachSanBay = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('user'));
    const roles = users?.roles?.[0];
    if (roles === 'ADMIN') {
      setIsAdmin(true);
    }
  }, []);
  const [sanbay, setSanBay] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sanBayToDelete, setSanBayToDelete] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      const danhSachSanBay = async () => {
        try {
          const res = await fetchSanBayPartner(userId);
          setSanBay(res.data.sanBay);
          console.log(res.data);
        } catch (error) {
          console.error('Không thể lấy dữ liệu trạm dừng:', error);
        }
      };
      danhSachSanBay();
    }
  }, []);

  console.log(isAdmin);

  useEffect(() => {
    if (isAdmin) {
      const danhSachSanBay = async () => {
        try {
          const res = await fetchAllSanBay();
          setSanBay(res.data);
          console.log(res.data);
        } catch (error) {
          console.error('Không thể lấy dữ liệu lịch chạy:', error);
        }
      };
      danhSachSanBay();
    }
  }, [isAdmin]);

  const showModal = (sanBay) => {
    setSanBayToDelete(sanBay);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (sanBayToDelete) {
      try {
        const response = await deleteSanBay(sanBayToDelete._id);
        if (response && response.EC === 0) {
          notification.success({
            message: 'Xóa sân bay',
            description: 'Xóa sân bay thành công',
          });
          setSanBay((prev) =>
            prev.filter((sanBay) => sanBay._id !== sanBayToDelete._id),
          );
        } else {
          alert(response.EM);
        }
      } catch (error) {
        console.error('Error deleting san bay:', error);
        alert('Đã xảy ra lỗi khi xóa sân bay');
      }
    }
    setIsModalVisible(false);
    setSanBayToDelete(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSanBayToDelete(null);
  };

  return (
    <div className="w-auto h-full bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-black text-4xl">Danh sách sân bay</h1>
        {!isAdmin && (
          <Link to="/airport/list/create">
            <Button variant="contained" color="primary">
              Thêm sân bay
            </Button>
          </Link>
        )}
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
              <TableCell sx={{ color: '#1a73e8', fontWeight: 'bold' }}>
                Mã sân bay
              </TableCell>
              <TableCell sx={{ color: '#1a73e8', fontWeight: 'bold' }}>
                Tên sân bay
              </TableCell>
              <TableCell sx={{ color: '#1a73e8', fontWeight: 'bold' }}>
                Thành phố
              </TableCell>
              {!isAdmin && (
                <TableCell sx={{ color: '#1a73e8', fontWeight: 'bold' }}>
                  Hành động
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {sanbay.map((sanBay) => (
              <TableRow
                key={sanBay._id}
                sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}
              >
                <TableCell>{sanBay.MaSB}</TableCell>
                <TableCell>{sanBay.TenSanBay}</TableCell>
                <TableCell>{sanBay.ThanhPho}</TableCell>
                {!isAdmin && (
                  <TableCell>
                    <IconButton color="error" onClick={() => showModal(sanBay)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal xác nhận xóa */}
      <AntdModal
        title="Xác nhận xóa"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Có"
        cancelText="Không"
      >
        <p>Bạn có chắc chắn muốn xóa sân bay này?</p>
      </AntdModal>
    </div>
  );
};

export default DanhSachSanBay;
