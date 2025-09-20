import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Film, MapPin, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react'; // ✅ Sửa lỗi import

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// --- Component con: Thông tin cá nhân ---
const UserInfo = ({ user, token }) => {
    const [formData, setFormData] = useState({ name: '', birthDate: '', phone: '', email: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
                phone: user.phone || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {
            setMessage({ type: '', text: '' }); // Reset message
            const res = await fetch(`${API_BASE}/api/users/me`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: 'Cập nhật thành công!' });
            } else {
                setMessage({ type: 'error', text: result.message || 'Cập nhật thất bại!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Lỗi kết nối!' });
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">Thông tin tài khoản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2 mt-1" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Ngày sinh</label>
                    <input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} className="w-full border rounded p-2 mt-1" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded p-2 mt-1" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <input name="email" value={formData.email} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-gray-100" disabled />
                </div>
            </div>
            <button onClick={handleSave} className="bg-yellow-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-yellow-600 transition">Lưu thay đổi</button>
            {message && <p className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
        </div>
    );
};

// --- Component con: Đổi mật khẩu ---
const ChangePassword = ({ token }) => {    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handleSave = async () => {
        setMessage({ type: '', text: '' });
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu mới không khớp.' });
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/users/change-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
            });
            const result = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
                setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            } else {
                setMessage({ type: 'error', text: result.message || 'Đổi mật khẩu thất bại!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Lỗi kết nối!' });
        }
    };

    return (
        <div className="space-y-4 mt-8">
            <h3 className="text-xl font-semibold border-b pb-2">Thay đổi mật khẩu</h3>
            <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handleChange} placeholder="Mật khẩu hiện tại" className="w-full border rounded p-2" />
            <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} placeholder="Mật khẩu mới" className="w-full border rounded p-2" />
            <input type="password" name="confirmNewPassword" value={passwords.confirmNewPassword} onChange={handleChange} placeholder="Xác nhận mật khẩu mới" className="w-full border rounded p-2" />
            <button onClick={handleSave} className="bg-yellow-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-yellow-600 transition">Đổi mật khẩu</button>
            {message && <p className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
        </div>
    );
};

// --- Component con: Lịch sử đặt vé ---
const BookingHistory = ({ bookings, loading, token, onActionSuccess }) => {
    if (loading) return <p>Đang tải lịch sử...</p>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Lịch sử giao dịch</h3>
            {bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map(b => <TicketCard key={b._id} booking={b} token={token} onActionSuccess={onActionSuccess} />)}
                </div>
            ) : (
                <p>Bạn chưa có lịch sử đặt vé nào.</p>
            )}
        </motion.div>
    );
};

// --- Component con: Thẻ vé điện tử ---
const TicketCard = ({ booking, token, onActionSuccess }) => {
    const handleCancel = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy vé này không? Hành động này không thể hoàn tác.')) return;

        try {
            const res = await fetch(`${API_BASE}/api/bookings/${booking._id}/cancel`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (res.ok) {
                alert('Hủy vé thành công!');
                onActionSuccess(); // Tải lại lịch sử
            } else {
                alert(`Lỗi: ${result.message}`);
            }
        } catch (error) {
            alert('Lỗi kết nối, không thể hủy vé.');
        }
    };

    const isCancellable = booking.status === 'confirmed' && new Date(booking.date) > new Date();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-50 border rounded-lg p-4 flex gap-4 items-start"
        >
            <img src={booking.movieId?.poster} alt={booking.movieId?.title} className="w-20 h-28 object-cover rounded-md flex-shrink-0" />
            <div className="flex-grow">
                <h4 className="font-bold text-lg">{booking.movieId?.title}</h4>
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <p className="flex items-center gap-2"><MapPin size={14} /> {booking.cinemaId?.name}</p>
                    <p className="flex items-center gap-2"><Calendar size={14} /> {new Date(booking.date).toLocaleDateString('vi-VN')}</p>
                    <p className="flex items-center gap-2"><Clock size={14} /> {booking.time}</p>
                    <p className="flex items-center gap-2"><Film size={14} /> Ghế: <span className="font-semibold">{booking.seats.join(', ')}</span></p>
                </div>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="font-bold text-lg text-yellow-600">{booking.totalPrice.toLocaleString('vi-VN')} VNĐ</p>
                {isCancellable && (
                    <button onClick={handleCancel} className="mt-2 text-xs text-red-600 hover:text-red-800 flex items-center gap-1 ml-auto">
                        <Trash2 size={14} /> Hủy vé
                    </button>
                )}
            </div>
        </motion.div>
    );
};

// --- Component con: Thành viên ---
const MembershipInfo = ({ user }) => (
    <div>
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Quyền lợi thành viên</h3>
        <div className="space-y-6">
            <div>
                <h4 className="font-bold text-lg text-yellow-600">C'FRIEND</h4>
                <p className="text-sm text-gray-500 mb-2">Được cấp khi mua 2 vé xem phim bất kỳ.</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Giảm 10% trực tiếp giá trị hóa đơn bắp nước.</li>
                    <li>Tặng 01 vé 2D/3D miễn phí vào tuần sinh nhật.</li>
                    <li>Cơ hội tham gia các sự kiện và chương trình khuyến mãi đặc biệt.</li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-lg text-blue-600">C'VIP</h4>
                <p className="text-sm text-gray-500 mb-2">Được cấp khi đạt 10.000 điểm.</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Tất cả quyền lợi của C'FRIEND.</li>
                    <li>Giảm 15% trực tiếp giá trị hóa đơn bắp nước.</li>
                    <li>Tặng 01 phần quà sinh nhật đặc biệt từ QieQie Cinema.</li>
                    <li>Lời mời tham dự các buổi công chiếu phim (Premiere) và sự kiện ra mắt phim.</li>
                </ul>
            </div>
        </div>
    </div>
);

// --- Component chính: UserDashboard ---
const UserDashboard = () => {
    const { user, logout } = useAuth(); // user từ context chỉ có id, role, username
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('history'); // ✅ Mặc định hiển thị tab lịch sử
    const [fullUser, setFullUser] = useState(null); // user đầy đủ thông tin từ API
    const token = localStorage.getItem('token');

    // ✅ BƯỚC 1: Chuyển state và logic fetch lịch sử lên đây
    const [bookings, setBookings] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    const fetchHistory = async () => {
        if (!token) return;
        setHistoryLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/bookings/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok && data.success) setBookings(data.data || []);
        } catch (error) {
            console.error("Lỗi lấy lịch sử:", error);
        } finally { setHistoryLoading(false); }
    };

    useEffect(() => {
        const fetchFullUser = async () => {
            if (token) {
                try {
                    const res = await fetch(`${API_BASE}/api/users/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (res.ok) setFullUser(data);
                } catch (error) {
                    console.error("Lỗi lấy thông tin user:", error);
                }
            }
        };

        fetchFullUser();
    }, [user, token]);

    // ✅ BƯỚC 2: Tải lịch sử khi người dùng chuyển sang tab "Lịch sử giao dịch"
    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab, token]); // Phụ thuộc vào activeTab và token

    const tabs = [
        { id: 'history', label: 'Lịch sử giao dịch' },
        { id: 'info', label: 'Thông tin tài khoản' },
        { id: 'membership', label: 'Thành viên' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'info': return (
                <>
                    <UserInfo user={fullUser} token={token} />
                    <ChangePassword token={token} />
                </>
            );
            case 'history': return <BookingHistory bookings={bookings} loading={historyLoading} token={token} onActionSuccess={fetchHistory} />;
            case 'membership': return <MembershipInfo user={fullUser} />;
            default: return <BookingHistory token={token} />;
        }
    };

    if (!user || !fullUser) return <div className="min-h-screen flex items-center justify-center"><p>Đang tải...</p></div>;

    return (
        <div className="min-h-screen bg-gray-100 pt-28 pb-12">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header Chào mừng */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Xin chào, {fullUser.name}!</h1>
                    <p className="text-gray-500">Chào mừng bạn quay trở lại.</p>
                </div>

                {/* Thẻ thành viên */}
                <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                    <div className="flex-1">
                        <p className="text-sm text-yellow-400 font-semibold">{fullUser.membership.level}</p>
                        <h2 className="text-2xl font-bold mt-1">{fullUser.name}</h2>
                        <div className="mt-4">
                            <p className="text-xs">Điểm hiện tại</p>
                            <p className="text-lg font-bold">{fullUser.membership.points}</p>
                        </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg">
                        <QRCodeSVG value={fullUser._id} size={80} />
                    </div>
                </div>

                {/* Tabs và Nội dung */}
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-yellow-500 text-yellow-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                             <button onClick={() => { logout(); navigate('/login'); }} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent text-sm font-medium text-red-500 hover:text-red-700 transition-colors ml-auto">Đăng xuất</button>
                        </nav>
                    </div>
                    <div>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;