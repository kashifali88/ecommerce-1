import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/userSlice";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
function Profile() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileRef = useRef();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // UPLOAD PROFILE IMAGE TO CLOUDINARY
  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_PROFILE_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      },
    );
    const result = await res.json();
    return result.secure_url;
  };

  // submit updated profile data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.oldPassword && !formData.newPassword) {
      dispatch(updateUserFailure("Please enter new password"));
      return;
    }
    if (formData.oldPassword && formData.newPassword) {
      if (formData.newPassword === formData.oldPassword) {
        dispatch(
          updateUserFailure("New password cannot be the same as old password"),
        );
        return;
      }
    }
    if (!formData.oldPassword && formData.newPassword) {
      dispatch(
        updateUserFailure("Please enter old password to update new password"),
      );
      return;
    }
    try {
      dispatch(updateUserStart());
      let avatar = currentUser?.avatar;
      if (file) {
        avatar = await uploadImage();
      }

      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...formData, avatar }),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(updateUserFailure(data.message || "Update user failed"));
        return;
      }
      dispatch(updateUserSuccess(data.updatedUser));
      toast.success("User updated successfully");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleDeleteUser = async () => {
    try {
      if (!deletePassword) {
        toast.error("Enter password first");
        return;
      }

      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
        return;
      }

      dispatch(deleteUserSuccess());
      toast.success("Account deleted");

      setShowDeleteModal(false);
      navigate("/login");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/*  RIGHT CONTENT */}
      <div className="flex-1 flex justify-center items-start p-6">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="file"
              hidden
              ref={fileRef}
              onChange={(e) => setFile(e.target.files[0])}
            />

            <img
              onClick={() => fileRef.current.click()}
              className="w-24 h-24 rounded-full object-cover self-center cursor-pointer border"
              src={file ? URL.createObjectURL(file) : currentUser?.avatar}
              alt=""
            />

            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg"
              placeholder="Username"
            />

            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-3 rounded-lg border-gray-300"
              placeholder="Email"
            />

            <input
              type="password"
              id="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="border p-3 rounded-lg border-gray-300"
              placeholder="Old Password"
            />

            <input
              type="password"
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="border p-3 rounded-lg border-gray-300"
              placeholder="New Password"
            />

            <button
              type="submit"
              className="flex items-center justify-center cursor-pointer bg-teal-600 text-white p-3 rounded-lg"
            >
              {loading ? <Spinner /> : "Update"}
            </button>

            {error && <p className="text-red-500">{error}</p>}
          </form>

          <div className="flex justify-between mt-4">
            <span
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 cursor-pointer"
            >
              Delete Account
            </span>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center">
          <div className="bg-gray-500 p-6 rounded-lg w-80">
            <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>

            <input
              type="password"
              placeholder="Enter password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full border p-2 rounded mb-4 outline-none"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
