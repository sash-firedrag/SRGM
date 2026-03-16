import { API_BASE_URL } from '../config';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const AdminDashboard = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    // UI State
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'enquiries' | 'products'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [enquiryFilter, setEnquiryFilter] = useState('all'); // 'all', 'pending', 'completed'
    const [enquirySearch, setEnquirySearch] = useState('');

    // Enquiries State
    const [enquiries, setEnquiries] = useState([]);

    // Products State
    const [products, setProducts] = useState([]);
    const [isEditingProduct, setIsEditingProduct] = useState(false);
    const [productForm, setProductForm] = useState({
        _id: null,
        name: '',
        category: '',
        description: '',
        features: '', // We'll split this by comma
        minOrderQuantity: 1,
        images: ''    // We'll split this by comma
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);

    // Modal State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const modalContentRef = useRef(null);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch Enquiries
            const enqRes = await axios.get(`${API_BASE_URL}/api/enquiry`, { headers: { Authorization: `Bearer ${token}` } });
            setEnquiries(enqRes.data.data);

            // Fetch Products
            const prodRes = await axios.get(`${API_BASE_URL}/api/products`);
            setProducts(prodRes.data.data);
        } catch (err) {
            console.error('Failed to fetch data', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                logout();
                navigate('/admin');
            } else {
                setError('Failed to load data. Please make sure the backend is running.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token, logout, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    // --- HELPER LOGIC ---
    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) {
            if (url.includes('mega.nz')) {
                return `${API_BASE_URL}/api/proxy-image?url=${encodeURIComponent(url)}`;
            }
            return url;
        }
        return `${API_BASE_URL}${url}`;
    };

    // --- MODAL LOGIC ---
    useEffect(() => {
        if (selectedProduct) {
            setCurrentSlideIndex(0);
            if (modalContentRef.current) {
                modalContentRef.current.scrollTo(0, 0);
            }
        }
    }, [selectedProduct]);

    const nextSlide = (e) => {
        e.stopPropagation();
        if (selectedProduct && selectedProduct.images) {
            setCurrentSlideIndex((prev) => (prev + 1) % selectedProduct.images.length);
        }
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        if (selectedProduct && selectedProduct.images) {
            setCurrentSlideIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
        }
    };

    // --- ENQUIRY ACTIONS ---
    const updateEnquiryStatus = async (id, newStatus) => {
        try {
            await axios.patch(`${API_BASE_URL}/api/enquiry/${id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            setError('Failed to update enquiry status.');
        }
    };

    const hideEnquiry = async (id) => {
        if (window.confirm('Are you sure you want to hide this enquiry from the dashboard? (It will be kept in the database)')) {
            try {
                await axios.patch(`${API_BASE_URL}/api/enquiry/${id}/hide`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchData();
            } catch (err) {
                setError('Failed to hide enquiry.');
            }
        }
    };

    const deleteEnquiryPermanently = async (id) => {
        if (window.confirm('WARNING: Are you sure you want to PERMANENTLY delete this enquiry? This action cannot be undone.')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/enquiry/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchData();
            } catch (err) {
                setError('Failed to delete enquiry permanently.');
            }
        }
    };

    // --- PRODUCT ACTIONS ---
    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProductForm(prev => ({ ...prev, [name]: value }));
    };

    const resetProductForm = () => {
        setIsEditingProduct(false);
        setProductForm({ _id: null, name: '', category: '', description: '', features: '', minOrderQuantity: 1, images: '' });
        setImageFiles([]);
    };

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploadingFiles(true);
        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }

            // Immediately upload to backend (which streams to Mega)
            const uploadRes = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Grab the new public Mega URLs
            const newUrls = uploadRes.data.paths.join(', ');

            setProductForm(prev => {
                const existing = prev.images ? prev.images.trim() : '';
                return {
                    ...prev,
                    images: existing ? `${existing}, ${newUrls}` : newUrls
                };
            });
            
            // Clear the file input
            e.target.value = '';
            setImageFiles([]);
        } catch (err) {
            console.error('File Upload Error:', err);
            alert('Failed to automatically upload images to cloud. Make sure the backend is active.');
        } finally {
            setIsUploadingFiles(false);
        }
    };

    const editProduct = (product) => {
        setIsEditingProduct(true);
        setProductForm({
            _id: product._id,
            name: product.name,
            category: product.category,
            description: product.description,
            features: (product.features || []).join(', '),
            minOrderQuantity: product.minOrderQuantity || 1,
            images: (product.images || []).join(', ')
        });
        setImageFiles([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchData();
            } catch (err) {
                setError('Failed to delete product.');
            }
        }
    };

    const submitProductForm = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: productForm.name,
                category: productForm.category,
                description: productForm.description,
                features: (productForm.features || '').split(',').map(s => s.trim()).filter(Boolean),
                minOrderQuantity: parseInt(productForm.minOrderQuantity, 10) || 1,
                images: (productForm.images || '').split(',').map(s => s.trim()).filter(Boolean)
            };

            if (isEditingProduct) {
                await axios.put(`${API_BASE_URL}/api/products/${productForm._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_BASE_URL}/api/products`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            resetProductForm();
            fetchData();
        } catch (err) {
            console.error('Submit Product Error:', err);
            setError(err.response?.data?.message || err.message || (isEditingProduct ? 'Failed to update product.' : 'Failed to create product.'));
        }
    };

    // --- ANALYTICS DATA PROCESSING ---
    const { enquiriesByDate, enquiriesByStatus, topRequestedItems } = useMemo(() => {
        if (!enquiries || enquiries.length === 0) {
            return { enquiriesByDate: [], enquiriesByStatus: [], topRequestedItems: [] };
        }

        // 1. Enquiries by Date (Last 7 Days)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }).reverse();

        const dateMap = {};
        last7Days.forEach(date => { dateMap[date] = 0; });

        enquiries.forEach(enq => {
            const dateStr = new Date(enq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (dateMap[dateStr] !== undefined) {
                dateMap[dateStr]++;
            }
        });

        const enquiriesByDateData = Object.keys(dateMap).map(date => ({
            date,
            enquiries: dateMap[date]
        }));

        // 2. Enquiries by Status
        const statusCounts = enquiries.reduce((acc, enq) => {
            acc[enq.status] = (acc[enq.status] || 0) + 1;
            return acc;
        }, {});

        const STATUS_COLORS = {
            pending: '#ffc107',
            processing: '#17a2b8',
            shipped: '#007bff',
            completed: '#28a745',
            cancelled: '#dc3545'
        };

        const enquiriesByStatusData = Object.keys(statusCounts).map(status => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: statusCounts[status],
            color: STATUS_COLORS[status] || '#6c757d'
        }));

        // 3. Top Requested Items
        const itemCounts = enquiries.reduce((acc, enq) => {
            acc[enq.item] = (acc[enq.item] || 0) + 1;
            return acc;
        }, {});

        const topRequestedItemsData = Object.keys(itemCounts)
            .map(item => ({ name: item, count: itemCounts[item] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5

        return {
            enquiriesByDate: enquiriesByDateData,
            enquiriesByStatus: enquiriesByStatusData,
            topRequestedItems: topRequestedItemsData
        };
    }, [enquiries]);

    return (
        <section className="reveal active" style={{ padding: '4rem 20px', minHeight: '80vh', backgroundColor: 'var(--bg-color)' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1rem', borderBottom: '2px solid #eaeaea' }}>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', fontSize: '2.5rem' }}>Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your latest product enquiries</p>
                    </div>
                    <button onClick={handleLogout} className="btn primary-btn" style={{ padding: '0.6rem 1.5rem', backgroundColor: '#dc3545', boxShadow: 'none' }}>
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="alert error" style={{ padding: '1rem', borderRadius: '8px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '2rem' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`btn ${activeTab === 'overview' ? 'primary-btn' : ''}`}
                        style={{ padding: '0.8rem 2rem', backgroundColor: activeTab === 'overview' ? 'var(--primary-color)' : '#eee', color: activeTab === 'overview' ? '#fff' : '#333', boxShadow: 'none', whiteSpace: 'nowrap' }}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('enquiries')}
                        className={`btn ${activeTab === 'enquiries' ? 'primary-btn' : ''}`}
                        style={{ padding: '0.8rem 2rem', backgroundColor: activeTab === 'enquiries' ? 'var(--primary-color)' : '#eee', color: activeTab === 'enquiries' ? '#fff' : '#333', boxShadow: 'none', whiteSpace: 'nowrap' }}
                    >
                        Enquiries ({enquiries.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`btn ${activeTab === 'products' ? 'primary-btn' : ''}`}
                        style={{ padding: '0.8rem 2rem', backgroundColor: activeTab === 'products' ? 'var(--primary-color)' : '#eee', color: activeTab === 'products' ? '#fff' : '#333', boxShadow: 'none', whiteSpace: 'nowrap' }}
                    >
                        Manage Products ({products.length})
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading...</div>
                ) : activeTab === 'overview' ? (
                    // OVERVIEW TAB (ANALYTICS)
                    <div className="analytics-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Summary Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid var(--primary-color)' }}>
                                <h4 style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Enquiries</h4>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{enquiries.length}</div>
                            </div>
                            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #ffc107' }}>
                                <h4 style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Enquiries</h4>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{enquiries.filter(e => e.status === 'pending').length}</div>
                            </div>
                            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #28a745' }}>
                                <h4 style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completed Orders</h4>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{enquiries.filter(e => e.status === 'completed').length}</div>
                            </div>
                            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid var(--secondary-color)' }}>
                                <h4 style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Products</h4>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{products.length}</div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                            {/* Line Chart: Enquiries Over Time */}
                            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-color)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Enquiries (Last 7 Days)</h3>
                                <div style={{ height: '300px', width: '100%' }}>
                                    <ResponsiveContainer>
                                        <LineChart data={enquiriesByDate} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                            <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <YAxis allowDecimals={false} tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <RechartsTooltip 
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                                                cursor={{ fill: 'transparent' }}
                                            />
                                            <Line type="monotone" dataKey="enquiries" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary-color)' }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Pie Chart: Status Breakdown */}
                            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-color)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Enquiries by Status</h3>
                                <div style={{ height: '300px', width: '100%' }}>
                                    {enquiriesByStatus.length > 0 ? (
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={enquiriesByStatus}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {enquiriesByStatus.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data available</div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Bar Chart: Top Items */}
                            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', gridColumn: '1 / -1' }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-color)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Top Requested Items</h3>
                                <div style={{ height: '300px', width: '100%' }}>
                                    {topRequestedItems.length > 0 ? (
                                        <ResponsiveContainer>
                                            <BarChart data={topRequestedItems} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                                                <XAxis type="number" allowDecimals={false} tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <YAxis type="category" dataKey="name" width={150} tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} cursor={{ fill: '#f8f9fa' }} />
                                                <Bar dataKey="count" fill="var(--secondary-color)" radius={[0, 4, 4, 0]} barSize={30} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data available</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'enquiries' ? (
                    // ENQUIRIES TAB
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button onClick={() => setEnquiryFilter('all')} className={`btn ${enquiryFilter === 'all' ? 'primary-btn' : ''}`} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', backgroundColor: enquiryFilter === 'all' ? 'var(--primary-color)' : '#fff', color: enquiryFilter === 'all' ? '#fff' : '#333' }}>All</button>
                                <button onClick={() => setEnquiryFilter('pending')} className={`btn ${enquiryFilter === 'pending' ? 'primary-btn' : ''}`} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', backgroundColor: enquiryFilter === 'pending' ? 'var(--primary-color)' : '#fff', color: enquiryFilter === 'pending' ? '#fff' : '#333' }}>Pending</button>
                                <button onClick={() => setEnquiryFilter('processing')} className={`btn ${enquiryFilter === 'processing' ? 'primary-btn' : ''}`} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', backgroundColor: enquiryFilter === 'processing' ? 'var(--primary-color)' : '#fff', color: enquiryFilter === 'processing' ? '#fff' : '#333' }}>Processing</button>
                                <button onClick={() => setEnquiryFilter('shipped')} className={`btn ${enquiryFilter === 'shipped' ? 'primary-btn' : ''}`} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', backgroundColor: enquiryFilter === 'shipped' ? 'var(--primary-color)' : '#fff', color: enquiryFilter === 'shipped' ? '#fff' : '#333' }}>Shipped</button>
                                <button onClick={() => setEnquiryFilter('completed')} className={`btn ${enquiryFilter === 'completed' ? 'primary-btn' : ''}`} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', backgroundColor: enquiryFilter === 'completed' ? 'var(--primary-color)' : '#fff', color: enquiryFilter === 'completed' ? '#fff' : '#333' }}>Completed</button>
                                <button onClick={() => setEnquiryFilter('cancelled')} className={`btn ${enquiryFilter === 'cancelled' ? 'primary-btn' : ''}`} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', backgroundColor: enquiryFilter === 'cancelled' ? '#dc3545' : '#fff', color: enquiryFilter === 'cancelled' ? '#fff' : '#333' }}>Cancelled</button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Search name, phone, or item..."
                                    style={{ padding: '0.6rem 1rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '250px' }}
                                    value={enquirySearch}
                                    onChange={(e) => setEnquirySearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {(() => {
                            const filteredEnquiries = enquiries.filter(enq => {
                                // Filter by status
                                if (enquiryFilter !== 'all' && enq.status !== enquiryFilter) return false;

                                // Filter by search term
                                if (enquirySearch.trim() !== '') {
                                    const searchLower = enquirySearch.toLowerCase();
                                    return (
                                        (enq.name && enq.name.toLowerCase().includes(searchLower)) ||
                                        (enq.phone && enq.phone.toLowerCase().includes(searchLower)) ||
                                        (enq.item && enq.item.toLowerCase().includes(searchLower))
                                    );
                                }
                                return true;
                            });

                            return filteredEnquiries.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                                    <h3 style={{ color: 'var(--text-muted)' }}>No enquiries found matching your filters.</h3>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: 'var(--primary-light)', color: '#fff' }}>
                                                <th style={{ padding: '1.2rem', fontWeight: '500' }}>Date</th>
                                                <th style={{ padding: '1.2rem', fontWeight: '500' }}>Name</th>
                                                <th style={{ padding: '1.2rem', fontWeight: '500' }}>Contact</th>
                                                <th style={{ padding: '1.2rem', fontWeight: '500' }}>Item</th>
                                                <th style={{ padding: '1.2rem', fontWeight: '500' }}>Status</th>
                                                <th style={{ padding: '1.2rem', fontWeight: '500' }}>Actions</th>
                                                <th style={{ padding: '1.2rem', fontWeight: '500', textAlign: 'center' }}>Manage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredEnquiries.map((enq) => (
                                                <tr key={enq._id} style={{ borderBottom: '1px solid #eaeaea', backgroundColor: enq.status === 'completed' ? '#f8fdf9' : '#fff' }}>
                                                    <td style={{ padding: '1.2rem' }}>{new Date(enq.createdAt).toLocaleDateString()}</td>
                                                    <td style={{ padding: '1.2rem', fontWeight: '600', color: 'var(--primary-color)' }}>{enq.name}</td>
                                                    <td style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>{enq.phone}</td>
                                                    <td style={{ padding: '1.2rem' }}>
                                                        <span
                                                            style={{
                                                                backgroundColor: 'var(--secondary-light)',
                                                                color: 'var(--primary-color)',
                                                                padding: '0.2rem 0.6rem',
                                                                borderRadius: '4px',
                                                                fontSize: '0.9rem',
                                                                cursor: products.find(p => p.name === enq.item) ? 'pointer' : 'default',
                                                                textDecoration: products.find(p => p.name === enq.item) ? 'underline' : 'none'
                                                            }}
                                                            onClick={() => {
                                                                const p = products.find(prod => prod.name === enq.item);
                                                                if (p) setSelectedProduct(p);
                                                            }}
                                                        >
                                                            {enq.item} ({enq.quantity} meters)
                                                        </span>
                                                        {enq.requirements && <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}><i>Req: {enq.requirements}</i></div>}
                                                    </td>
                                                    <td style={{ padding: '1.2rem' }}>
                                                        {(() => {
                                                            const statusColors = {
                                                                pending: { bg: '#fff3cd', text: '#856404' },
                                                                processing: { bg: '#cce5ff', text: '#004085' },
                                                                shipped: { bg: '#d1ecf1', text: '#0c5460' },
                                                                completed: { bg: '#d4edda', text: '#155724' },
                                                                cancelled: { bg: '#f8d7da', text: '#721c24' }
                                                            };
                                                            const currentStatus = statusColors[enq.status] || statusColors.pending;

                                                            return (
                                                                <span style={{
                                                                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
                                                                    backgroundColor: currentStatus.bg,
                                                                    color: currentStatus.text
                                                                }}>
                                                                    {enq.status.toUpperCase()}
                                                                </span>
                                                            );
                                                        })()}
                                                    </td>
                                                    <td style={{ padding: '1.2rem' }}>
                                                        <select
                                                            value={enq.status}
                                                            onChange={(e) => updateEnquiryStatus(enq._id, e.target.value)}
                                                            style={{
                                                                padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer',
                                                                backgroundColor: '#f8f9fa',
                                                                fontWeight: '500', color: '#333', minWidth: '120px'
                                                            }}>
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                    <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                            <button 
                                                                onClick={() => hideEnquiry(enq._id)}
                                                                style={{ padding: '0.4rem 0.8rem', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                                            >
                                                                Hide (Keep in DB)
                                                            </button>
                                                            <button 
                                                                onClick={() => deleteEnquiryPermanently(enq._id)}
                                                                style={{ padding: '0.4rem 0.8rem', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                                            >
                                                                Delete Permanently
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })()}
                    </div>
                ) : (
                    // PRODUCTS TAB
                    <div>
                        <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', marginBottom: '3rem' }}>
                            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                                {isEditingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <form onSubmit={submitProductForm} className="modern-form">
                                <div className="form-row" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                    <div className="form-group" style={{ flex: '2 1 200px' }}>
                                        <label>Product Name</label>
                                        <input type="text" name="name" value={productForm.name} onChange={handleProductChange} required placeholder="e.g. Traditional Dhoties" />
                                    </div>
                                    <div className="form-group" style={{ flex: '1 1 150px' }}>
                                        <label>Category</label>
                                        <input type="text" name="category" value={productForm.category} onChange={handleProductChange} required placeholder="e.g. Menswear" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" value={productForm.description} onChange={handleProductChange} required rows="3" placeholder="Detailed product description..."></textarea>
                                </div>
                                <div className="form-group" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1 1 300px' }}>
                                        <label>Features (comma separated)</label>
                                        <input type="text" name="features" value={productForm.features} onChange={handleProductChange} placeholder="100% Cotton, Handloom, Size M-XL" />
                                    </div>
                                    <div style={{ flex: '1 1 150px' }}>
                                        <label>Minimum Order Quantity (in meters)</label>
                                        <input type="number" name="minOrderQuantity" value={productForm.minOrderQuantity} onChange={handleProductChange} min="1" required style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    </div>
                                </div>
                                <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <label>Existing Image URLs (comma separated optionally)</label>
                                        <input type="text" name="images" value={productForm.images} onChange={handleProductChange} placeholder="https://link.to/image.jpg" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label>Or Upload New Local Images</label>
                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*" 
                                            onChange={handleFileChange} 
                                            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} 
                                            disabled={isUploadingFiles}
                                        />
                                        {isUploadingFiles && <p style={{ color: 'var(--primary-color)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Uploading to Cloud...</p>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" className="btn primary-btn" style={{ border: 'none' }} disabled={isUploadingFiles}>
                                        {isEditingProduct ? 'Update Product' : 'Save Product'}
                                    </button>
                                    {isEditingProduct && (
                                        <button type="button" onClick={resetProductForm} className="btn" style={{ backgroundColor: '#6c757d', border: 'none' }}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                            {products.map(product => (
                                <div
                                    key={product._id}
                                    className="product-card"
                                    style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    {product.images && product.images.length > 0 && (
                                        <div style={{ width: '100%', height: '200px', backgroundColor: '#f8f9fa', overflow: 'hidden' }}>
                                            <img
                                                src={getImageUrl(product.images[0])}
                                                alt={product.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}
                                    <div style={{ padding: '1.5rem', flexGrow: 1 }}>
                                        <span className="category-tag">{product.category}</span>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', fontSize: '1.4rem', margin: '0.5rem 0' }}>{product.name}</h3>
                                        <p style={{ color: 'var(--text-muted)' }}>{product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}</p>
                                    </div>
                                    <div style={{ display: 'flex', borderTop: '1px solid #eaeaea' }} onClick={e => e.stopPropagation()}>
                                        <button onClick={(e) => { e.stopPropagation(); editProduct(product); }} style={{ flex: 1, padding: '1rem', border: 'none', borderRight: '1px solid #eaeaea', backgroundColor: '#f8f9fa', cursor: 'pointer', fontWeight: '600', color: 'var(--primary-color)' }}>
                                            Edit
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteProduct(product._id); }} style={{ flex: 1, padding: '1rem', border: 'none', backgroundColor: '#f8f9fa', cursor: 'pointer', fontWeight: '600', color: '#dc3545' }}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Product Details Modal (Reused from Products.jsx) */}
            <div className={`modal-overlay ${selectedProduct ? 'active' : ''}`} onClick={() => setSelectedProduct(null)}>
                <div 
                    ref={modalContentRef}
                    className="modal-content product-modal" 
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close modal">&times;</button>

                    {selectedProduct && (
                        <div className="product-details-container">
                            {/* Slideshow */}
                            {selectedProduct.images && selectedProduct.images.length > 0 && (
                                <div className="product-slideshow">
                                    <div className="slideshow-wrapper">
                                        <img
                                            src={getImageUrl(selectedProduct.images[currentSlideIndex])}
                                            alt={`${selectedProduct.name} view ${currentSlideIndex + 1}`}
                                            className="active-slide"
                                            style={{ objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                                        />
                                        {selectedProduct.images.length > 1 && (
                                            <>
                                                <button className="slide-btn prev-btn" onClick={prevSlide}>&#10094;</button>
                                                <button className="slide-btn next-btn" onClick={nextSlide}>&#10095;</button>
                                            </>
                                        )}
                                    </div>
                                    {selectedProduct.images.length > 1 && (
                                        <div className="slideshow-dots">
                                            {selectedProduct.images.map((_, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`dot ${currentSlideIndex === idx ? 'active' : ''}`}
                                                    onClick={(e) => { e.stopPropagation(); setCurrentSlideIndex(idx); }}
                                                ></span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Details */}
                            <div className="product-info">
                                <span className="category-tag">{selectedProduct.category}</span>
                                <h2>{selectedProduct.name}</h2>
                                <p className="product-description">
                                    {selectedProduct.description}
                                </p>

                                {selectedProduct.features && selectedProduct.features.length > 0 && (
                                    <div className="product-features">
                                        <h3>Features</h3>
                                        <ul>
                                            {selectedProduct.features.map((feature, index) => (
                                                <li key={index}>✓ {feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section >
    );
};

export default AdminDashboard;
