<<<<<<< HEAD
import React, { useEffect, useState } from 'react';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('bookings');
    if (stored) {
      setBookings(JSON.parse(stored));
    }
  }, []);

  if (bookings.length === 0) {
    return <div className="p-10 text-center text-gray-600">Chưa có đặt vé nào.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Lịch sử đặt vé</h2>

      <div className="space-y-6">
        {bookings.map((b, index) => (
          <div key={index} className="p-4 border rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{b.movie.title}</h3>
            <p><strong>Suất chiếu:</strong> {b.showtime}</p>
            <p><strong>Ghế:</strong> {b.selectedSeats.join(', ')}</p>
            <p><strong>Khách:</strong> {b.customer.name} - {b.customer.phone}</p>
            <p className="text-sm text-gray-500">
              Đặt lúc: {new Date(b.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;
=======
// JavaScript
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useSearchParams } from 'react-router-dom';

const DEFAULT_LIMIT = 10;

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState('active'); // active | confirmed | all | cancelled
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(DEFAULT_LIMIT);
    const [total, setTotal] = useState(0);
    const [statusCounts, setStatusCounts] = useState([]);
    const totalPages = useMemo(() => Math.max(Math.ceil(total / limit), 1), [total, limit]);

    // Search (client-side)
    const [search, setSearch] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(true);
    const refreshTimer = useRef(null);

    // Detail modal
    const [detailOpen, setDetailOpen] = useState(false);
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const openIdRef = useRef(null);

    // Khi mount, lưu open param (nếu có) để mở sau khi load danh sách
    useEffect(() => {
        const openId = searchParams.get('open');
        openIdRef.current = openId;
    }, [searchParams]);

    // Fetch data when filters change
    useEffect(() => {
        fetchBookingHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, page, limit, from, to]);

    // Sau khi fetch xong, nếu có openId thì mở chi tiết
    useEffect(() => {
        if (!loading && openIdRef.current) {
            const id = openIdRef.current;
            openIdRef.current = null; // tránh mở lại nhiều lần
            fetchBookingDetail(id);
            // Xoá query 'open' khỏi URL để người dùng refresh không mở lại
            const sp = new URLSearchParams(searchParams);
            sp.delete('open');
            setSearchParams(sp, { replace: true });
        }
    }, [loading, bookings, searchParams, setSearchParams]);

    // Auto refresh mỗi 30s
    useEffect(() => {
        if (autoRefresh) {
            refreshTimer.current = setInterval(() => {
                fetchBookingHistory(false);
            }, 30000);
        }
        return () => {
            if (refreshTimer.current) clearInterval(refreshTimer.current);
        };
    }, [autoRefresh, statusFilter, page, limit, from, to]);

    const fetchBookingHistory = async (withSpinner = true) => {
        try {
            if (withSpinner) setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Vui lòng đăng nhập để xem lịch sử đặt vé');
                if (withSpinner) setLoading(false);
                return;
            }

            const params = new URLSearchParams();
            params.set('status', statusFilter || 'active');
            params.set('page', String(page));
            params.set('limit', String(limit));
            if (from) params.set('from', from);
            if (to) params.set('to', to);

            const response = await fetch(`/api/bookings/history?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setBookings(data.data || []);
                setTotal(data.total || 0);
                setStatusCounts((data.debug && data.debug.statusCounts) || []);
            } else {
                setError(data.message || 'Không thể tải lịch sử đặt vé');
            }
        } catch (err) {
            console.error('❌ Lỗi khi tải lịch sử:', err);
            setError('Có lỗi xảy ra khi tải lịch sử đặt vé: ' + err.message);
        } finally {
            if (withSpinner) setLoading(false);
        }
    };

    const fetchBookingDetail = async (id) => {
        try {
            setDetailOpen(true);
            setDetail(null);
            setDetailError(null);
            setDetailLoading(true);

            const token = localStorage.getItem('token');
            if (!token) {
                setDetailError('Vui lòng đăng nhập lại.');
                return;
            }

            const res = await fetch(`/api/bookings/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error(`Không thể tải chi tiết vé (status ${res.status})`);
            }

            const data = await res.json();
            setDetail(data);
        } catch (e) {
            console.error('Lỗi chi tiết vé:', e);
            setDetailError(e.message || 'Lỗi không xác định');
        } finally {
            setDetailLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (!window.confirm('Bạn có chắc muốn hủy vé này?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/bookings/${id}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message || `HTTP ${res.status}`);
            }
            // Refresh list & detail
            await fetchBookingHistory(false);
            if (detail?. _id === id) {
                setDetail({ ...detail, status: 'cancelled' });
            }
            alert('Hủy vé thành công.');
        } catch (e) {
            alert(e.message || 'Hủy vé thất bại');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount || 0);
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '—';
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? '—' : d.toLocaleString('vi-VN');
    };

    const StatusBadge = ({ status }) => {
        const map = {
            confirmed: { text: 'Đã xác nhận', cls: 'bg-green-100 text-green-800' },
            pending: { text: 'Chờ xác nhận', cls: 'bg-yellow-100 text-yellow-800' },
            cancelled: { text: 'Đã hủy', cls: 'bg-gray-200 text-gray-700' },
            expired: { text: 'Hết hạn', cls: 'bg-gray-200 text-gray-700' }
        };
        const s = map[status] || { text: status, cls: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
                {s.text}
            </span>
        );
    };

    const canCancel = (b) => {
        if (b?.status !== 'confirmed') return false;
        // Cần trước giờ chiếu ít nhất 2 tiếng
        const showDT = new Date(`${b?.date} ${b?.time}`);
        const diffMs = showDT.getTime() - Date.now();
        const diffHours = diffMs / 3600000;
        return diffHours >= 2;
    };

    const filtered = useMemo(() => {
        if (!search) return bookings;
        const s = search.toLowerCase().trim();
        return bookings.filter(b => {
            const movie = b?.movieId?.title?.toLowerCase() || '';
            const cinema = b?.cinemaId?.name?.toLowerCase() || '';
            const seatStr = Array.isArray(b?.seats) ? b.seats.join(',').toLowerCase() : (b?.seats || '').toLowerCase();
            return movie.includes(s) || cinema.includes(s) || seatStr.includes(s);
        });
    }, [search, bookings]);

    const buildQrPayload = (b) => {
        const payload = {
            bookingId: b?._id,
            userId: b?.user?._id || b?.user,
            movie: b?.movieId?.title,
            cinema: b?.cinemaId?.name,
            date: b?.date,
            time: b?.time,
            seats: b?.seats,
            v: 1
        };
        return JSON.stringify(payload);
    };

    // Header bar: tabs + search + filters
    const Tab = ({ value, label }) => (
        <button
            onClick={() => { setStatusFilter(value); setPage(1); }}
            className={`px-3 py-2 text-sm rounded-md border ${statusFilter === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
        >
            {label}
        </button>
    );

    const Summary = () => {
        const map = Object.fromEntries(statusCounts.map(s => [s._id, s.count]));
        return (
            <div className="text-xs text-gray-600">
                <span className="mr-3">Confirmed: {map.confirmed || 0}</span>
                <span className="mr-3">Pending: {map.pending || 0}</span>
                <span className="mr-3">Cancelled: {map.cancelled || 0}</span>
                <span>Expired: {map.expired || 0}</span>
            </div>
        );
    };

    const LoadingSkeleton = () => (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-lg p-6">
                    <div className="h-6 w-1/3 bg-gray-200 rounded" />
                    <div className="mt-3 h-4 w-2/3 bg-gray-200 rounded" />
                    <div className="mt-2 h-4 w-1/2 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    );

    return (
        <>
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Lịch sử đặt vé</h2>
                    <div className="flex items-center gap-2">
                        <Summary />
                        <label className="ml-4 flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
                            Tự làm mới (30s)
                        </label>
                        <button
                            onClick={() => fetchBookingHistory()}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Làm mới
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Tab value="active" label="Đang hiệu lực" />
                    <Tab value="confirmed" label="Đã xác nhận" />
                    <Tab value="all" label="Tất cả" />
                    <Tab value="cancelled" label="Đã hủy" />
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm theo phim, rạp, ghế..."
                        className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => { setFrom(e.target.value); setPage(1); }}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => { setTo(e.target.value); setPage(1); }}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <select
                        value={limit}
                        onChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(1); }}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                        {[5, 10, 20, 30, 50].map(n => <option key={n} value={n}>{n}/trang</option>)}
                    </select>
                </div>

                {loading ? (
                    <LoadingSkeleton />
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        {error}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center bg-gray-50 rounded-lg p-8">
                        <h3 className="text-lg font-medium text-gray-900">Không tìm thấy vé</h3>
                        <p className="text-gray-500 mt-1">Thử đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((booking) => (
                            <div
                                key={booking._id}
                                className="group bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition hover:shadow-md cursor-pointer"
                                onClick={() => fetchBookingDetail(booking._id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter') fetchBookingDetail(booking._id); }}
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                {booking.movieId?.poster ? (
                                                    <img
                                                        src={booking.movieId.poster}
                                                        alt={booking.movieId?.title || 'Movie'}
                                                        className="w-20 h-28 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-28 bg-gray-200 rounded-lg" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                        {booking.movieId?.title || 'Phim không xác định'}
                                                    </h3>
                                                    <StatusBadge status={booking.status} />
                                                </div>
                                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                                    <div>
                                                        <p><span className="font-medium">Rạp:</span> {booking.cinemaId?.name || '—'}</p>
                                                        <p className="mt-1"><span className="font-medium">Ngày chiếu:</span> {booking.date || '—'}</p>
                                                        <p className="mt-1"><span className="font-medium">Giờ chiếu:</span> {booking.time || '—'}</p>
                                                    </div>
                                                    <div>
                                                        <p><span className="font-medium">Ghế:</span> {Array.isArray(booking.seats) ? booking.seats.join(', ') : (booking.seats || '—')}</p>
                                                        <p className="mt-1"><span className="font-medium">Tổng tiền:</span> <span className="text-blue-600 font-semibold">{formatCurrency(booking.totalPrice)}</span></p>
                                                        <p className="mt-1"><span className="font-medium">Ngày đặt:</span> {formatDateTime(booking.createdAt)}</p>
                                                    </div>
                                                </div>
                                                {booking.combos && booking.combos.length > 0 && (
                                                    <div className="mt-2 text-sm text-gray-600 line-clamp-1">
                                                        <span className="font-medium text-gray-700">Combo:</span>{' '}
                                                        {booking.combos.map((c) => (c?.name || c?.comboId?.name || 'Combo') + ' x' + (c?.quantity ?? 1)).join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-4 flex flex-col items-end gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); fetchBookingDetail(booking._id); }}
                                                className="inline-flex items-center px-3 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium"
                                            >
                                                Xem chi tiết & QR
                                            </button>
                                            {canCancel(booking) && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); cancelBooking(booking._id); }}
                                                    className="inline-flex items-center px-3 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium"
                                                >
                                                    Hủy vé
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && filtered.length > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Trang {page}/{totalPages} • Tổng {total} vé
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                className={`px-3 py-2 rounded-md border text-sm ${page <= 1 ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                            >
                                Trang trước
                            </button>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                className={`px-3 py-2 rounded-md border text-sm ${page >= totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                            >
                                Trang sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {detailOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setDetailOpen(false)} />
                    <div className="relative bg-white w-full max-w-3xl mx-4 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold">Chi tiết vé</h3>
                            <button onClick={() => setDetailOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 max-h-[80vh] overflow-y-auto">
                            {detailLoading && (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Đang tải chi tiết...</span>
                                </div>
                            )}

                            {detailError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                                    {detailError}
                                </div>
                            )}

                            {detail && (
                                <div id="ticket-print-area" className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            {detail.movieId?.poster ? (
                                                <img
                                                    src={detail.movieId.poster}
                                                    alt={detail.movieId?.title || 'Movie'}
                                                    className="w-24 h-36 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-24 h-36 bg-gray-200 rounded-lg" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xl font-semibold">{detail.movieId?.title || 'Phim'}</h4>
                                                <StatusBadge status={detail.status} />
                                            </div>
                                            <div className="mt-2 text-sm text-gray-700 space-y-1">
                                                <p><span className="font-medium">Rạp:</span> {detail.cinemaId?.name || '—'}</p>
                                                <p><span className="font-medium">Suất chiếu:</span> {detail.date || '—'} • {detail.time || '—'}</p>
                                                <p><span className="font-medium">Ghế:</span> {Array.isArray(detail.seats) ? detail.seats.join(', ') : (detail.seats || '—')}</p>
                                                <p><span className="font-medium">Tổng tiền:</span> {formatCurrency(detail.totalPrice)}</p>
                                                <p><span className="font-medium">Ngày đặt:</span> {formatDateTime(detail.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h5 className="text-sm font-semibold text-gray-800">Thông tin người mua</h5>
                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                                            <p><span className="font-medium">Tên:</span> {detail.user?.username || '—'}</p>
                                            <p><span className="font-medium">Email:</span> {detail.user?.email || '—'}</p>
                                            <p><span className="font-medium">SĐT:</span> {detail.user?.phone || '—'}</p>
                                        </div>
                                    </div>

                                    {detail.combos && detail.combos.length > 0 && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h5 className="text-sm font-semibold text-gray-800">Combo đã chọn</h5>
                                            <ul className="mt-2 text-sm text-gray-700 list-disc list-inside space-y-1">
                                                {detail.combos.map((c, i) => {
                                                    const name = c?.name || c?.comboId?.name || 'Combo';
                                                    const price = (c?.price ?? c?.comboId?.price ?? 0) * (c?.quantity ?? 1);
                                                    return (
                                                        <li key={i}>
                                                            {name} x{c?.quantity ?? 1} — {formatCurrency(price)}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="bg-white border rounded-lg p-4">
                                        <h5 className="text-sm font-semibold text-gray-800 mb-2">Mã QR vé</h5>
                                        <div className="flex items-center space-x-4">
                                            <QRCodeCanvas value={buildQrPayload(detail)} size={160} includeMargin />
                                            <div className="text-sm text-gray-600">
                                                <p>Quét mã tại rạp để vào phòng chiếu.</p>
                                                <p className="mt-1"><span className="font-medium">Mã vé:</span> {detail._id}</p>
                                                <p className="mt-1"><span className="font-medium">Trạng thái:</span> {detail.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t flex flex-wrap items-center justify-between gap-2">
                            <div className="text-sm text-gray-600">
                                {detail && canCancel(detail) && (
                                    <button
                                        onClick={() => cancelBooking(detail._id)}
                                        className="px-3 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-50"
                                    >
                                        Hủy vé
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        // In khu vực vé
                                        const printContents = document.getElementById('ticket-print-area')?.innerHTML || '';
                                        const w = window.open('', '_blank', 'width=800,height=900');
                                        if (w) {
                                            w.document.write(`<html><head><title>In vé</title></head><body>${printContents}</body></html>`);
                                            w.document.close();
                                            w.focus();
                                            w.print();
                                            w.close();
                                        }
                                    }}
                                    className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    In vé
                                </button>
                                <button
                                    onClick={() => setDetailOpen(false)}
                                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookingHistory;
>>>>>>> b32aa75 (update code)
