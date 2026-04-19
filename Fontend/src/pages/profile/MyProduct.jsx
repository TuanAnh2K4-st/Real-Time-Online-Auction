import { useEffect, useState } from "react";
import {
  getRootCategories,
  getChildCategories,
  createProduct,
  getProvinces,
  getStoresByProvince,
  filterProducts
} from "../../services/api/profileApi";

import { Plus } from "lucide-react";

export default function MyProduct() {

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===== FILTER =====
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("ALL");

  // CATEGORY
  const [rootCategories, setRootCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedRoot, setSelectedRoot] = useState("");
  const [selectedChild, setSelectedChild] = useState("");

  // PROVINCE + STORE
  const [provinces, setProvinces] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");

  // FORM
  const [form, setForm] = useState({
    productName: "",
    brand: "",
    origin: "",
    productCondition: "NEW",
    description: "",
    basePrice: "",
    storeId: "",
  });

  const [attributes, setAttributes] = useState({});

  // IMAGES
  const [primaryImage, setPrimaryImage] = useState(null);
  const [subImages, setSubImages] = useState([]);

  const attributeMap = {
    Laptop: ["cpu", "ram", "storage"],
    Phone: ["screen", "battery"],
  };

  // ================= LOAD =================
  useEffect(() => {
    getRootCategories().then(res => {
      setRootCategories(Array.isArray(res) ? res : res.data || []);
    });

    getProvinces().then(res =>
      setProvinces(res.data || [])
    );

    handleFilter();
  }, []);

  // ================= FILTER =================
  const handleFilter = async () => {
    try {
      const res = await filterProducts({
        productName: keyword || null,
        itemStatus: status === "ALL" ? null : status
      });

      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      handleFilter();
    }, 400);

    return () => clearTimeout(delay);
  }, [keyword, status]);

  // ================= CATEGORY =================
  const handleRootChange = async (e) => {
    const id = e.target.value;

    setSelectedRoot(id);
    setSelectedChild("");
    setChildCategories([]);
    setAttributes({});

    if (!id) return;

    const res = await getChildCategories(id);

    setChildCategories(Array.isArray(res) ? res : res.data || []);
  };

  const handleChildChange = (e) => {
    setSelectedChild(e.target.value);
    setAttributes({});
  };

  // ================= PROVINCE =================
  const handleProvinceChange = async (e) => {
    const id = e.target.value;

    setSelectedProvince(id);
    setStores([]);
    setForm(prev => ({ ...prev, storeId: "" }));

    if (!id) return;

    const res = await getStoresByProvince(id);
    setStores(res.data || []);
  };

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAttributeChange = (key, value) => {
    setAttributes(prev => ({ ...prev, [key]: value }));
  };

  const selectedCategory = childCategories.find(c => c.id == selectedChild);
  const fields = attributeMap[selectedCategory?.name] || [];

  // ================= IMAGE =================
  const handlePrimaryImage = (e) => {
    setPrimaryImage(e.target.files[0]);
  };

  const handleSubImages = (e) => {
    const files = Array.from(e.target.files);

    if (subImages.length + files.length > 5) {
      alert("Tối đa 5 ảnh phụ");
      return;
    }

    setSubImages(prev => [...prev, ...files]);
  };

  const removePrimaryImage = () => {
    setPrimaryImage(null);
  };

  const removeSubImage = (index) => {
    setSubImages(prev => prev.filter((_, i) => i !== index));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!primaryImage) return alert("Phải chọn ảnh chính");
      if (!selectedChild) return alert("Phải chọn category");
      if (!form.storeId) return alert("Phải chọn store");

      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      formData.append("categoryId", selectedChild);
      formData.append("attributesJson", JSON.stringify(attributes));
      formData.append("primaryImage", primaryImage);

      subImages.forEach(img => {
        formData.append("subImages", img);
      });

      await createProduct(formData);

      alert("Tạo thành công!");

      handleFilter();
      setShowForm(false);

    } catch (err) {
      console.error(err);
      alert("Lỗi tạo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Sản phẩm của tôi</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} />
          Đăng sản phẩm
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-6">
        <input
          placeholder="Tìm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="input w-1/3"
        />

        {["ALL", "APPROVED", "REJECTED"].map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-2 rounded 
              ${status === s ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {products.map(p => (
          <div key={p.id} className="border rounded-xl p-3 shadow">
            <img
              src={p.imageUrl || "https://via.placeholder.com/150"}
              className="w-full h-40 object-cover rounded"
            />

            <h3 className="font-semibold mt-2">{p.productName}</h3>

            <p className="text-red-500 font-bold">
              {p.basePrice?.toLocaleString()} VND
            </p>

            <p className="text-sm text-gray-500">
              {p.street}, {p.wardName}, {p.provinceName}
            </p>

            <p className="text-sm font-medium mt-1">
              {p.itemStatus}
            </p>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white w-[600px] max-h-[90vh] overflow-y-auto p-6 rounded-xl space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold">Đăng sản phẩm</h3>

            <input name="productName" placeholder="Tên sản phẩm" onChange={handleChange} className="input" />
            <input name="brand" placeholder="Brand" onChange={handleChange} className="input" />
            <input name="origin" placeholder="Origin" onChange={handleChange} className="input" />

            <select name="productCondition" value={form.productCondition} onChange={handleChange} className="input">
              <option value="NEW">Mới</option>
              <option value="USED">Đã sử dụng</option>
            </select>

            <textarea name="description" placeholder="Mô tả" onChange={handleChange} className="input" />

            <input name="basePrice" placeholder="Giá" onChange={handleChange} className="input" />

            <select value={selectedRoot} onChange={handleRootChange} className="input">
              <option value="">Danh mục</option>
              {rootCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select value={selectedChild} onChange={handleChildChange} className="input">
              <option value="">Loại</option>
              {childCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select value={selectedProvince} onChange={handleProvinceChange} className="input">
              <option value="">Tỉnh</option>
              {provinces.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              value={form.storeId}
              onChange={(e) => setForm({ ...form, storeId: e.target.value })}
              className="input"
            >
              <option value="">Cửa hàng</option>
              {stores.map(s => (
                <option key={s.storeId} value={s.storeId}>
                  {s.storeName} - {s.street}, {s.wardName}, {s.provinceName}
                </option>
              ))}
            </select>

            {/* IMAGE */}
            <div>
              <p>Ảnh chính:</p>
              <input type="file" onChange={handlePrimaryImage} />
              {primaryImage && (
                <div>
                  <img src={URL.createObjectURL(primaryImage)} className="w-24" />
                  <button onClick={removePrimaryImage}>X</button>
                </div>
              )}
            </div>

            <div>
              <p>Ảnh phụ:</p>
              <input type="file" multiple onChange={handleSubImages} />
              {subImages.map((img, i) => (
                <div key={i}>
                  <img src={URL.createObjectURL(img)} className="w-20" />
                  <button onClick={() => removeSubImage(i)}>X</button>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`p-2 rounded text-white 
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"}`}
            >
              {loading ? "Đang tạo..." : "Tạo sản phẩm"}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}