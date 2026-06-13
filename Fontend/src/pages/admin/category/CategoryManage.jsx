import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, X, Plus, Calendar, Tag, Folder, Layers, Trash2, Edit3, 
  ChevronRight, ChevronDown, Sparkles, Filter, Moon, Sun, Info, 
  CornerDownRight, ListCollapse, FolderPlus, HelpCircle, Clock, AlertTriangle
} from 'lucide-react';
import {
  getAllCategories,
  filterCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../../../services/api/adminCategoryApi";

// Dữ liệu mẫu mô phỏng chính xác cấu trúc quan hệ JPA/Hibernate Category (gồm Parent & Children)
const INITIAL_CATEGORIES = [
  {
    categoryId: 1,
    name: "Đồng hồ xa xỉ",
    createAt: "2026-05-10T08:00:00",
    parent: null,
    childrenIds: [3, 4]
  },
  {
    categoryId: 2,
    name: "Túi xách thời trang",
    createAt: "2026-05-12T09:30:00",
    parent: null,
    childrenIds: [5, 6]
  },
  {
    categoryId: 3,
    name: "Đồng hồ cơ thể thao",
    createAt: "2026-05-13T10:15:00",
    parent: { categoryId: 1, name: "Đồng hồ xa xỉ" },
    childrenIds: []
  },
  {
    categoryId: 4,
    name: "Đồng hồ Dress Watch cổ điển",
    createAt: "2026-05-14T11:20:00",
    parent: { categoryId: 1, name: "Đồng hồ xa xỉ" },
    childrenIds: []
  },
  {
    categoryId: 5,
    name: "Túi xách da cá sấu",
    createAt: "2026-05-15T14:00:00",
    parent: { categoryId: 2, name: "Túi xách thời trang" },
    childrenIds: []
  },
  {
    categoryId: 6,
    name: "Balo & Túi du lịch cao cấp",
    createAt: "2026-05-16T16:45:00",
    parent: { categoryId: 2, name: "Túi xách thời trang" },
    childrenIds: []
  },
  {
    categoryId: 7,
    name: "Tranh & Nghệ thuật",
    createAt: "2026-05-18T08:00:00",
    parent: null,
    childrenIds: []
  }
];

export default function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, ROOT (Danh mục gốc), SUB (Danh mục con)

  // Modal State cho việc Thêm/Sửa Danh mục
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('CREATE'); // CREATE hoặc EDIT
  const [currentEditId, setCurrentEditId] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formParentId, setFormParentId] = useState(''); // Chọn danh mục cha

  // Trạng thái thu gọn/mở rộng các danh mục con trong giao diện cây danh mục
  const [expandedRootIds, setExpandedRootIds] = useState({ 1: true, 2: true });

  const loadCategories = async () => {
    try {
      // axiosClient đã unwrap response.data rồi, nên response chính là data
      const response = await getAllCategories();
      const list = Array.isArray(response) ? response : (response?.data ?? []);
      setCategories(list);
    } catch (error) {
      console.error("Load categories error:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {

      handleFilter(searchQuery, filterType);

    }, 500);

    return () => clearTimeout(timer);

  }, [searchQuery, filterType]);

  // Bộ lọc tìm kiếm thông minh
  const handleFilter = async (
    keyword = searchQuery,
    type = filterType
  ) => {
    try {
      // axiosClient đã unwrap response.data rồi
      const response = await filterCategories({ keyword, type });
      const list = Array.isArray(response) ? response
        : Array.isArray(response?.data) ? response.data
        : [];
      setCategories(list);
    } catch (error) {
      console.error(error);
    }
  };


  // Mở rộng hoặc thu gọn danh mục cha
  const toggleExpand = (id) => {
    setExpandedRootIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Mở modal tạo mới danh mục
  const handleOpenCreate = () => {
    setModalType('CREATE');
    setFormName('');
    setFormParentId('');
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa danh mục
  const handleOpenEdit = (category) => {
    setModalType('EDIT');
    setCurrentEditId(category.categoryId);
    setFormName(category.name);
    setFormParentId(category.parent ? category.parent.categoryId.toString() : '');
    setIsModalOpen(true);
  };

  // Xử lý nộp Form (Thêm / Sửa)
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formName.trim()) return;

    const parentCategory = formParentId 
      ? categories.find(c => c.categoryId === parseInt(formParentId))
      : null;

    if (modalType === "CREATE") {

      try {

        await createCategory({
          name: formName,
          parentId: formParentId
            ? Number(formParentId)
            : null
        });

        await loadCategories();

        setIsModalOpen(false);

      } catch (error) {
        // axiosClient reject với error.response?.data trực tiếp
        alert(error?.message || error?.error || "Tạo danh mục thất bại");
      }

      return;
    }else {
      try {

        await updateCategory(currentEditId, {
          name: formName,
          parentId: formParentId
            ? Number(formParentId)
            : null
        });

        await loadCategories();

        setIsModalOpen(false);

      } catch (error) {
        alert(error?.message || error?.error || "Cập nhật thất bại");
      }

      return;
    };
    setIsModalOpen(false);
  };

  // Xóa danh mục (xử lý an toàn ràng buộc dữ liệu phân cấp)
  const handleDeleteCategory = async (categoryId) => {

    if (!window.confirm("Bạn có chắc muốn xóa?")) {
      return;
    }

    try {

      await deleteCategory(categoryId);

      await loadCategories();

      if (
        selectedCategory?.categoryId === categoryId
      ) {
        setSelectedCategory(null);
      }

    } catch (error) {
      alert(error?.message || error?.error || "Xóa thất bại");
    }
  };

  // Tìm danh sách các danh mục con tương ứng của một danh mục
  const getChildrenOf = (cat) => {
    return categories.filter(c => c.parent?.categoryId === cat.categoryId);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}>

      {/* THÂN WORKSPACE CHÍNH */}
      <main className="max-w-[1600px] mx-auto p-6 space-y-8">
        
        {/* BỘ LỌC VÀ Ô TÌM KIẾM + NÚT TẠO DANH MỤC MỚI */}
        <section className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tight">Danh sách danh mục sản phẩm</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Cơ cấu cây thư mục và ngày khởi tạo dữ liệu</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Thanh Tìm kiếm */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên danh mục..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className={`w-full border rounded-xl py-2 pl-9 pr-8 text-xs focus:outline-none focus:border-indigo-500 transition-all bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Lọc nhanh danh mục */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { code: 'ALL', name: 'Tất cả' },
                { code: 'ROOT', name: 'Nhóm gốc' },
                { code: 'SUB', name: 'Nhóm phụ' }
              ].map(type => (
                <button
                  key={type.code}
                  onClick={() => {
                    setFilterType(type.code);
                    handleFilter(searchQuery, type.code);
                  }}
                  className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase transition-all border bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}
                >
                  {type.name}
                </button>
              ))}
            </div>

            {/* Nút Tạo danh mục mới */}
            <button 
              onClick={handleOpenCreate}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
            >
              <FolderPlus size={14} /> Thêm danh mục
            </button>
          </div>
        </section>

        {/* THÂN WORKSPACE: DANH SÁCH + BIỂU MẪU CHI TIẾT */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* BẢNG CÂY DANH MỤC PHÂN CẤP */}
          <div className={`${selectedCategory ? 'xl:col-span-7' : 'xl:col-span-12'} rounded-3xl overflow-hidden shadow-sm border transition-all duration-300 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest w-[100px]">Mã ID</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Tên danh mục phân cấp</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Cấp độ danh mục</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Ngày tạo hệ thống</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center w-[120px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {categories.map((cat) => {
                    const hasParent = cat.parent !== null;
                    if (hasParent && !searchQuery && filterType === 'ALL') {
                      return null; 
                    }

                    const children = getChildrenOf(cat);
                    const isExpanded = !!expandedRootIds[cat.categoryId];

                    return (
                      <React.Fragment key={cat.categoryId}>
                        {/* Hàng cha */}
                        <tr 
                          className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selectedCategory?.categoryId === cat.categoryId ? 'bg-indigo-500/5' : ''}`}
                          onClick={() => setSelectedCategory(cat)}
                        >
                          <td className="px-6 py-4 font-mono text-xs text-slate-400">
                            #{cat.categoryId}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {children.length > 0 && !searchQuery && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpand(cat.categoryId);
                                  }}
                                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400"
                                >
                                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                              )}
                              <div className="flex items-center gap-2">
                                <Folder className="text-indigo-500" size={16} />
                                <span className="text-xs font-black dark:text-white">{cat.name}</span>
                                {children.length > 0 && (
                                  <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase">
                                    {children.length} danh mục con
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              Danh mục gốc
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-400">
                            {new Date(cat.createAt).toLocaleString('vi-VN')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => handleOpenEdit(cat)}
                                className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-all"
                                title="Chỉnh sửa danh mục"
                              >
                                <Edit3 size={14}/>
                              </button>
                              <button 
                                onClick={() => handleDeleteCategory(cat.categoryId)}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Xóa danh mục"
                              >
                                <Trash2 size={14}/>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Hàng con được mở rộng */}
                        {isExpanded && !searchQuery && filterType === 'ALL' && children.map((sub) => (
                          <tr 
                            key={sub.categoryId}
                            className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer bg-slate-50/40 dark:bg-slate-900/10 ${selectedCategory?.categoryId === sub.categoryId ? 'bg-indigo-500/5' : ''}`}
                            onClick={() => setSelectedCategory(sub)}
                          >
                            <td className="px-6 py-3.5 font-mono text-xs text-slate-400 pl-12">
                              #{sub.categoryId}
                            </td>
                            <td className="px-6 py-3.5 pl-12">
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <CornerDownRight size={14} className="text-slate-400" />
                                <Tag className="text-teal-500" size={14} />
                                <span className="text-xs font-bold">{sub.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                Con của #{cat.categoryId}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-xs font-mono text-slate-400">
                              {new Date(sub.createAt).toLocaleString('vi-VN')}
                            </td>
                            <td className="px-6 py-3.5">
                              <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  onClick={() => handleOpenEdit(sub)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-all"
                                  title="Chỉnh sửa danh mục"
                                >
                                  <Edit3 size={14}/>
                                </button>
                                <button 
                                  onClick={() => handleDeleteCategory(sub.categoryId)}
                                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                  title="Xóa danh mục"
                                >
                                  <Trash2 size={14}/>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {categories.length === 0 && (
              <div className="p-16 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <AlertTriangle size={36} className="mb-3 opacity-30 text-amber-500" />
                <p className="text-xs font-black uppercase tracking-widest italic mb-2">Không tìm thấy danh mục thầu nào</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-600">Thử thay đổi từ khóa hoặc bộ lọc phân loại</p>
                <button 
                  onClick={() => { setSearchQuery(''); setFilterType('ALL'); }}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* CHI TIẾT DANH MỤC */}
          {selectedCategory ? (
            <div className="xl:col-span-5 space-y-6 animate-in slide-in-from-right-4 duration-300 relative h-fit xl:sticky xl:top-24">
              <div className={`border rounded-3xl p-6 shadow-xl relative bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}>
                <button 
                  onClick={() => setSelectedCategory(null)} 
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-500/5"
                  title="Đóng bảng chi tiết"
                >
                  <X size={16} />
                </button>

                {/* HEADER CHI TIẾT */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Folder size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black dark:text-white uppercase italic leading-tight">
                      {selectedCategory.name}
                    </h3>
                    <p className="text-[9px] text-slate-500 font-mono">ID Danh mục: #{selectedCategory.categoryId}</p>
                  </div>
                </div>

                {/* THÔNG TIN CHI TIẾT */}
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Cấp độ hiện tại</span>
                    {selectedCategory.parent ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-500 mt-1">
                        <span>Danh mục con của:</span>
                        <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 font-black">
                          {selectedCategory.parent.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-black text-emerald-500 italic mt-1 block">
                        Danh mục cấp cao nhất (Danh mục gốc)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Ngày khởi tạo</span>
                      <span className="text-xs font-bold dark:text-white block mt-1 font-mono">
                        {new Date(selectedCategory.createAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Số nhánh con trực thuộc</span>
                      <span className="text-base font-black text-indigo-500 italic block mt-0.5 font-mono">
                        {getChildrenOf(selectedCategory).length} nhánh
                      </span>
                    </div>
                  </div>

                  {/* DANH SÁCH DANH MỤC PHỤ TRỰC THUỘC */}
                  <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                      Các danh mục trực thuộc bên trong (@OneToMany children)
                    </span>
                    
                    {getChildrenOf(selectedCategory).length === 0 ? (
                      <p className="text-[10px] text-slate-400 italic">
                        Không có danh mục con trực thuộc danh mục này.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {getChildrenOf(selectedCategory).map(sub => (
                          <div 
                            key={sub.categoryId} 
                            onClick={() => setSelectedCategory(sub)}
                            className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-black/20 border border-slate-100 dark:border-white/5 hover:border-indigo-500/50 cursor-pointer transition-all"
                          >
                            <span className="text-xs font-bold dark:text-slate-200">@{sub.name}</span>
                            <span className="text-[8px] font-mono text-slate-400">ID: #{sub.categoryId}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* HÀNH ĐỘNG HỆ THỐNG */}
                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-white/5 flex gap-3">
                  <button
                    onClick={() => handleOpenEdit(selectedCategory)}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                  >
                    <Edit3 size={12} /> Sửa cấu hình
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(selectedCategory.categoryId)}
                    className="flex-1 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                  >
                    <Trash2 size={12} /> Xóa danh mục
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* TRẠNG THÁI CHƯA CHỌN DANH MỤC */
            <div className="hidden xl:flex xl:col-span-5 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl p-12 flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
            </div>
          )}
        </section>
      </main>

      {/* MODAL THÊM / SỬA DANH MỤC */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className={`border rounded-3xl p-6 shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black uppercase italic mb-6 flex items-center gap-2">
              <Folder size={18} className="text-indigo-500" /> 
              {modalType === 'CREATE' ? 'Thiết lập danh mục thầu mới' : 'Cập nhật danh mục thầu'}
            </h3>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Tên danh mục *</label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ví dụ: Đồng hồ thông minh, Cổ vật triều Lê..."
                  className={`w-full border rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}
                />
              </div>

              <div>
                <label className="block text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Danh mục cha (Để trống nếu là danh mục gốc)</label>
                <select
                  value={formParentId}
                  onChange={(e) => setFormParentId(e.target.value)}
                  className="w-full border rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-indigo-500 bg-white border-slate-200"
                >
                  <option value="">Không có (Đặt làm Danh mục gốc)</option>
                  {categories
                    .filter(c => c.parent === null && c.categoryId !== currentEditId)
                    .map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name} (# {cat.categoryId})
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20"
                >
                  {modalType === 'CREATE' ? 'Khởi tạo danh mục' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}