import { useEffect, useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";

export default function Profile() {
  const { profile, loadProfile } = useContext(ProfileContext);

  useEffect(() => {
    loadProfile();
  }, []);

  if (!profile) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      
      {/* Avatar + Name */}
      <div className="flex items-center gap-4">
        <img
          src={profile.avatarUrl || "https://via.placeholder.com/100"}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />

        <div>
          <h2 className="text-2xl font-bold">{profile.fullName}</h2>
          <p className="text-gray-500">{profile.job}</p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500">Số điện thoại</p>
          <p className="font-semibold">{profile.phone}</p>
        </div>

        <div>
          <p className="text-gray-500">Giới tính</p>
          <p className="font-semibold">{profile.gender}</p>
        </div>

        <div>
          <p className="text-gray-500">Địa chỉ</p>
          <p className="font-semibold">
            {profile.street}, {profile.wardName}, {profile.provinceName}
          </p>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-6">
        <p className="text-gray-500">Giới thiệu</p>
        <p className="mt-2">{profile.bio}</p>
      </div>

      {/* Button */}
      <div className="mt-6 text-right">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600">
          Chỉnh sửa
        </button>
      </div>
    </div>
  );
}