import { useEffect, useState } from "react";
import {
  getRootCategories,
  getChildCategories,
  createProduct,
  getProvinces,
  getStoresByProvince
} from "../../services/api/profileApi";

import { Plus } from "lucide-react";

export default function MyProduct() {

  const [showForm, setShowForm] = useState(false);

  // ================= CATEGORY =================
  const [rootCategories, setRootCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedRoot, setSelectedRoot] = useState("");
  const [selectedChild, setSelectedChild] = useState("");

  // ================= PROVINCE + STORE =================
  const [provinces, setProvinces] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");

  // ================= FORM =================
  const [form, setForm] = useState({
    productName: "",
    brand: "",
    origin: "",
    productCondition: "NEW",
    description: "",
    basePrice: "",
    storeId: "",
  });

  // ================= ATTRIBUTES =================
  const [attributes, setAttributes] = useState({});

  // ================= IMAGE =================
  const [primaryImage, setPrimaryImage] = useState(null);
  const [subImages, setSubImages] = useState([]);

  // demo attributes
  const attributeMap = {
    Laptop: ["cpu", "ram", "storage"],
    Phone: ["screen", "battery"],
  };

  // ================= LOAD ROOT CATEGORY =================
  useEffect(() => {
    const fetch = async () => {
      const res = await getRootCategories();
      const data = Array.isArray(res) ? res : res.data || [];
      setRootCategories(data);
    };
    fetch();
  }, []);

  // ================= LOAD PROVINCES =================
  useEffect(() => {
    const fetch = async () => {
      const res = await getProvinces();
      const data = Array.isArray(res) ? res : res.data || [];
      setProvinces(data);
    };
    fetch();
  }, []);

  // ================= CATEGORY =================
  const handleRootChange = async (e) => {
    const parentId = e.target.value;

    setSelectedRoot(parentId);
    setSelectedChild("");
    setAttributes({});
    setChildCategories([]);

    if (!parentId) return;

    const res = await getChildCategories(parentId);
    const data = Array.isArray(res) ? res : res.data || [];
    setChildCategories(data);
  };

  const handleChildChange = (e) => {
    setSelectedChild(e.target.value);
    setAttributes({});
  };

  // ================= PROVINCE -> STORE =================
  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;

    setSelectedProvince(provinceId);
    setStores([]);
    setForm((prev) => ({ ...prev, storeId: "" }));

    if (!provinceId) return;

    const res = await getStoresByProvince(provinceId);
    const data = Array.isArray(res) ? res : res.data || [];

    setStores(data);
  };

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAttributeChange = (key, value) => {
    setAttributes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const selectedCategory = childCategories.find(
    (c) => c.id == selectedChild
  );

  const fields = attributeMap[selectedCategory?.name] || [];

  // ================= IMAGE =================
  const handlePrimaryImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPrimaryImage(file);
  };

  const handleSubImages = (e) => {
    const files = Array.from(e.target.files);
    setSubImages((prev) => [...prev, ...files]);
  };

  const removeSubImage = (index) => {
    setSubImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!primaryImage) {
        alert("Phải chọn 1 ảnh chính");
        return;
      }

      if (!selectedChild) {
        alert("Phải chọn category");
        return;
      }

      if (!form.storeId) {
        alert("Phải chọn store");
        return;
      }

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      formData.append("categoryId", selectedChild);
      formData.append("attributesJson", JSON.stringify(attributes));
      formData.append("primaryImage", primaryImage);

      subImages.forEach((img) => {
        formData.append("subImages", img);
      });

      await createProduct(formData);

      alert("Tạo sản phẩm thành công!");

      // reset
      setShowForm(false);
      setForm({
        productName: "",
        brand: "",
        origin: "",
        productCondition: "NEW",
        description: "",
        basePrice: "",
        storeId: "",
      });
      setAttributes({});
      setPrimaryImage(null);
      setSubImages([]);

    } catch (err) {
      console.error(err);
      alert("Lỗi tạo sản phẩm");
    }
  };

  // ================= UI =================
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Sản phẩm của tôi</h2>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          <Plus size={18} />
          Đăng sản phẩm
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-xl space-y-4 border">

          {/* BASIC */}
          <input name="productName" placeholder="Tên sản phẩm" onChange={handleChange} className="input" />
          <input name="brand" placeholder="Brand" onChange={handleChange} className="input" />
          <input name="origin" placeholder="Origin" onChange={handleChange} className="input" />
          <input name="basePrice" placeholder="Giá" onChange={handleChange} className="input" />

          {/* CATEGORY */}
          <select value={selectedRoot} onChange={handleRootChange} className="input">
            <option value="">Chọn danh mục</option>
            {rootCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select value={selectedChild} onChange={handleChildChange} className="input">
            <option value="">Chọn loại</option>
            {childCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* PROVINCE */}
          <select value={selectedProvince} onChange={handleProvinceChange} className="input">
            <option value="">Chọn tỉnh</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* STORE */}
          <select
            value={form.storeId}
            onChange={(e) => setForm({ ...form, storeId: e.target.value })}
            className="input"
          >
            <option value="">Chọn cửa hàng</option>
            {stores.map((s) => (
              <option key={s.storeId} value={s.storeId}>{s.storeName}</option>
            ))}
          </select>

          {/* ATTRIBUTES */}
          {fields.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Thông số:</p>
              {fields.map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  onChange={(e) => handleAttributeChange(field, e.target.value)}
                  className="input"
                />
              ))}
            </div>
          )}

          {/* IMAGE */}
          <div>
            <label>Ảnh chính (1 ảnh):</label>
            <input type="file" onChange={handlePrimaryImage} />
          </div>

          <div>
            <label>Ảnh phụ:</label>
            <input type="file" multiple onChange={handleSubImages} />

            <div className="flex gap-2 mt-2 flex-wrap">
              {subImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    className="w-20 h-20 object-cover"
                  />
                  <button
                    onClick={() => removeSubImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            Tạo sản phẩm
          </button>
        </div>
      )}
    </div>
  );
}