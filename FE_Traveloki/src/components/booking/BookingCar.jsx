import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'react-router-dom';

import Loading from '../../pages/loading/index';

// import { paymentSend } from '../../services/api/payment/index'
// import { createBookingCar, GetBookingCarId } from '../../services/api/booking/api.bookingCar'

import {
  faUser,
  faBagShopping,
  faCaretDown,
  faCaretUp,
  faPlaneArrival,
  faCalendarDays,
} from '@fortawesome/free-solid-svg-icons';
const BookingCar = () => {
  const [searchParams] = useSearchParams();
  const SanBay = searchParams.get("SanBay");
  const Date = searchParams.get("Date");
  const Time = searchParams.get("Time");
  const IDTram = searchParams.get("MaTram"); // 66a928805951552933eb1b2d
  const id = searchParams.get("DetailCarID");
  const diemDonTra = searchParams.get("DiemKetThuc")
  const userId = JSON.parse(localStorage.getItem("user"));
  // console.log("San bay:", SanBay);
  // console.log("ID Time:", Time);
  // console.log("ID Date:", Date);
  // console.log("ID IDTram:", IDTram); // ???
  // console.log("ID DetailCarID:", id);
  // console.log("Diem don tra:", diemDonTra);
  // console.log("userId:", userId._id);

  const [detail, setDetail] = useState(null);
  const [tram, setTram] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [bookingCar, setBookingCar] = useState({
    MaDetailCar: id,
    Sdt: '',
    MaTram: '',
    DiemSanBay: SanBay,
    DiemDon_Tra: '',
    NgayGioDat: `${Date}-${Time}`,
    SoKm: '',
    ThanhTien: '' || 0,
    TrangThai: false,
    Description: "",
    userId: userId._id,
    currency:"VND",
    name: "Booking car",
    image: "https://www.youtube.com/watch?v=TD7sBUigDIU",
    quantity: 1,
    price: '' || 0,
    return_url: 'http://localhost:5173/list/cars/result',
  });

  console.log("bookingCar begin::", bookingCar)
  const fetchDetailCar = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/GetDetailCarID/${id}`,
      );
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await res.json();
      console.log('detail car::', result);
      setDetail(result);

      setBookingCar((prevBookingCar) => ({
        ...prevBookingCar,
        MaDetailCar: result._id,
        ThanhTien: result.SoTien_1km * (tram?.cost || 0),
      }));
    } catch (error) {
      setError('Không thể lấy dữ liệu từ máy chủ detail cars');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTram = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/GetTramDungID/${IDTram}`,
      );
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await res.json();
      setTram(result);
      // console.log("fetTram::",[tram.tramDung._id]) // ??
      console.log("result fetTram:: ", result)
      setBookingCar((prevBookingCar) => ({
        ...prevBookingCar,
        SoKm: result.cost,
        MaTram: result.tramDung._id,
        DiemDon_Tra: diemDonTra,
      }));
    } catch (error) {
      setError('Không thể lấy dữ liệu từ máy chủ tram');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTram();
    fetchDetailCar();
  }, [IDTram]);

  useEffect(() => {
    if (detail && tram) {
      setBookingCar((prevBookingCar) => ({
        ...prevBookingCar,
        DiemSanBay: SanBay,
        DiemDon_Tra: diemDonTra,
        NgayGioDat: `${Date}-${Time}`,
        SoKm: tram?.cost,
        ThanhTien: detail?.SoTien_1km * tram?.cost,
        Sdt: prevBookingCar.Sdt,
        Description: prevBookingCar.Description,
        TrangThai: prevBookingCar.TrangThai,
        price: detail?.SoTien_1km,
        return_url: `${import.meta.env.VITE_FE_URL}/list/cars/result`,
      }));
    }
  }, [detail, tram]);

  /**
   * #region old service
   * @param {*} e
   * @returns
   */

  const handlePayment = async (e) => {
    e.preventDefault();
    console.log('Dữ liệu gửi đi:', bookingCar);

    const {
      Sdt, MaTram, DiemSanBay, DiemDon_Tra, NgayGioDat, SoKm,
      ThanhTien, Description, userId
    } = bookingCar;

    // Kiểm tra dữ liệu đầu vào
    if (
      !Sdt ||
      !MaTram ||
      !DiemSanBay ||
      !DiemDon_Tra ||
      !NgayGioDat ||
      !SoKm ||
      !ThanhTien ||
      !Description
    ) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      const resBooking = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/BookingCar`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            MaDetailCar: id,
            Sdt,
            MaTram,
            DiemSanBay,
            DiemDon_Tra,
            NgayGioDat,
            SoKm,
            ThanhTien,
            Description,
            userId
          }),
        },
      );

      // Xử lý phản hồi từ server
      const data = await resBooking.json();
      console.log('Phản hồi từ server đặt xe:', data);

      if (resBooking.ok) {
        const datXeOto = data; // Chỉnh sửa nếu cần thiết để phù hợp với cấu trúc dữ liệu trả về
        console.log('Đã nhận được ID đơn hàng:', datXeOto._id);

        try {
          console.log({
            amount: ThanhTien,
            currency: bookingCar.currency,
            message: bookingCar.Description,
            return_url: `${import.meta.env.VITE_FE_URL}/list/cars/result`,
            orderID: datXeOto.MaDX,
            userID: bookingCar.userId,
          })

          // Goi api server den thư viện pointer
          const response = await fetch(
            // https://api-traveloki.onrender.com/api/payment/pointer-wallet/car
            `${import.meta.env.VITE_BACKEND_URL}/api/payment/pointer-wallet/car`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization:
                  'Bearer ' + import.meta.env.VITE_SECRET_API_KEY_POINTER,
              },
              body: JSON.stringify({
                amount: ThanhTien,
                currency: bookingCar.currency,
                message: bookingCar.Description,
                userID: bookingCar.userId,
                orderID: datXeOto.MaDX,
                returnUrl: bookingCar.return_url,
                name: bookingCar.name,
                image: bookingCar.image,
                description: bookingCar.Description,
                quantity: bookingCar.quantity,
                price: bookingCar.ThanhTien,
              }),
            },
          );

          // console.log(response.data.url)
          if (response.ok) {
            const data = await response.json(); // Đọc nội dung từ body của phản hồi
            console.log('Phản hồi từ server tạo payment:', data);
            window.location.replace(data.metadata);
          } else {
            alert(response.error || 'Đã xảy ra lỗi khi truyền dữ liệu - 265');
          }
        } catch (error) {
          console.log('Lỗi khi truyền dữ liệu:', error);
          alert('Không thể truyền dữ liệu');
        }
      } else {
        alert(data.error || 'Đã xảy ra lỗi khi đặt xe');
      }
    } catch (error) {
      console.error('Lỗi khi kết nối tới máy chủ:', error);
      alert('Đã xảy ra lỗi khi kết nối tới máy chủ');
    }
  };

  if (isLoading)
    return (
      // <div className="text-center text-4xl translate-y-1/2 h-full font-extrabold">
      //   Loading...
      // </div>
      <Loading />
    );
  if (error)
    return (
      <div className="text-center text-4xl translate-y-1/2 h-full font-extrabold">
        Error: {error}
      </div>
    );

  const handleClick = () => {
    setShow((prevShow) => !prevShow);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price);
  };

  const handle_Change = (e) => {
    const { name, value } = e.target;
    setBookingCar((prevBookingCar) => ({
      ...prevBookingCar,
      [name]: value,
    }));
  };

  return (
    <div className="p-4 w-full h-full pb-28 overflow-y-auto">
      <span className="bg-white w-[96%] p-2 -top-0 absolute font-bold text-xl">
        <span className="font-extrabold text-green-500 px-4">{SanBay}</span> -
        <span className="font-extrabold text-green-500 px-4">{diemDonTra}</span>
      </span>
      <div className="w-full mt-8">
        <div className="flex text-gray-500">
          <span>
            <FontAwesomeIcon icon={faUser} />
            <span className="ml-2">{detail?.SoGheToiDa} passenger(s)</span>
          </span>
          <span className="ml-3">
            <FontAwesomeIcon icon={faBagShopping} />
            <span className="ml-2">{detail?.SoHanhLyToiDa} baggage(s)</span>
          </span>
        </div>
        <div className="w-full text-right font-bold cursor-pointer">
          <span onClick={handleClick} className="ml-3 text-blue-500">
            <FontAwesomeIcon icon={show ? faCaretUp : faCaretDown} />
            <span className="ml-1"> Car Detail</span>
          </span>
        </div>
        {show && (
          <div className="mt-2">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-400">
                  <th className="border px-4 py-2">Tên hãng xe</th>
                  <th className="border px-4 py-2">Tên chủ sở hữu</th>
                  <th className="border px-4 py-2">Biển số xe</th>
                  <th className="border px-4 py-2">Số hành lý tối đa</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-black">
                  <td className="border px-4 py-2">{detail?.TenHangXe}</td>
                  <td className="border px-4 py-2">{detail?.TenChuSoHuu}</td>
                  <td className="border px-4 py-2">{detail?.BienSoXe}</td>
                  <td className="border px-4 py-2">{detail?.SoHanhLyToiDa}</td>
                </tr>
              </tbody>
              <thead>
                <tr className="bg-green-400">
                  <th className="border px-4 py-2">Công ty</th>
                  <th className="border px-4 py-2">Số ghế tối đa</th>
                  <th className="border px-4 py-2">Số tiền/km</th>
                  <th className="border px-4 py-2">Mã Sân Bay</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-black">
                  <td className="border px-4 py-2">{detail?.CongTy}</td>
                  <td className="border px-4 py-2">{detail?.SoGheToiDa}</td>
                  <td className="border px-4 py-2">{detail?.SoTien_1km}</td>
                  <td className="border px-4 py-2">{detail?.MaSB}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mt-2 bg-slate-100 p-4">
        <label className="font-bold">
          <span className="text-blue-500">○</span> Điểm sân bay
        </label>
        <div className="grid grid-cols-2 pl-4 ml-[5.3px] border-l-4">
          <div className="p-2">
            <label className="font-bold">Sân bay</label>
            <p className="border mt-2 mb-4 text-slate-500 border-gray-500 bg-slate-50 rounded-md p-2">
              <FontAwesomeIcon icon={faPlaneArrival} />
              <span className="ml-2">{SanBay}</span>
            </p>
            <label className="font-bold">Lịch đi</label>
            <p className="border mt-2 text-slate-500 border-gray-500 bg-slate-50 rounded-md p-2">
              <FontAwesomeIcon icon={faCalendarDays} />
              <span className="ml-2">
                {Date} - {Time}
              </span>
            </p>
          </div>
          <div className="p-2">
            <label className="font-bold">Mô tả cho tài xế</label>
            <input
              className="border mt-2 mb-4 outline-none text-slate-500 border-gray-500 bg-slate-50 rounded-md p-2 w-full"
              type="text"
              placeholder="Nhập mô tả"
              name="Description"
              value={bookingCar.Description}
              onChange={handle_Change}
            />
            <label className="font-bold">Số điện thoại</label>
            <input
              className="border mt-2 mb-4 outline-none text-slate-500 border-gray-500 bg-slate-50 rounded-md p-2 w-full"
              type="text"
              placeholder="Nhập số điện thoại liên hệ"
              name="Sdt"
              value={bookingCar.Sdt}
              onChange={handle_Change}
            />
          </div>
        </div>
        <label className="font-bold">
          <span className="text-blue-500">●</span> Điểm đón-trả
        </label>
        <div className="p-2 pl-8">
          <p className="border mt-2 mb-4 text-slate-500 border-gray-500 bg-slate-50 rounded-md p-2">
            <FontAwesomeIcon icon={faPlaneArrival} />
            <span className="ml-2">{bookingCar.DiemDon_Tra}</span>
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 bg-white p-4 w-[96%]">
        <div className="flex float-right">
          <div className="w-fit">
            <p className="text-gray-500 text-sm text-right">Tổng tiền xe</p>
            <span className="text-lg text-orange-400">
              {formatPrice(bookingCar.ThanhTien)} VND
            </span>
          </div>
          <button
            onClick={handlePayment}
            className="bg-orange-500 ml-4 w-fit text-white font-bold rounded-lg p-2"
          >
            Booking Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCar;
