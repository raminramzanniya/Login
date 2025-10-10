import React, { useEffect, useState } from "react";
import "./Users.css";
import { Modal, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function Users() {
  // --------------------------
  // State ها
  // --------------------------
  const [users, setUsers] = useState([]); // لیست کاربران
  const [loading, setLoading] = useState(true); // حالت لودینگ
  const [showDeleteModal, setShowDeleteModal] = useState(false); // مودال حذف
  const [selectedUserId, setSelectedUserId] = useState(""); // کاربر انتخاب شده برای حذف
  const [refreshData, setRefreshData] = useState(false); // برای ری‌لود لیست بعد حذف

  // --------------------------
  // گرفتن لیست کاربران از Firebase
  // --------------------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "https://admin-p1-default-rtdb.firebaseio.com/users.json"
        );
        const data = await res.json();
        setUsers(Object.entries(data)); // تبدیل به [id, user]
      } catch (err) {
        console.error("خطا در دریافت کاربران:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshData]); // هر بار refreshData تغییر کنه دوباره fetch می‌کنه

  // --------------------------
  // تابع حذف کاربر
  // --------------------------
  const removeHandler = async (userId) => {
    try {
      const res = await fetch(
        `https://admin-p1-default-rtdb.firebaseio.com/users/${userId}.json`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("خطا در حذف کاربر");
      console.log("حذف شد:", userId);
    } catch (err) {
      console.error(err);
    }
  };

  // --------------------------
  // نمایش پیام لودینگ قبل از دریافت دیتا
  // --------------------------
  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  // --------------------------
  // JSX اصلی
  // --------------------------
  return (
    <div className="container-Users">
      <h1 className="title">لیست کاربران</h1>

      <table>
        <thead>
          <tr>
            <th>ردیف</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(([id, user], index) => (
            <tr key={id}>
              <td>{index + 1}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td className="action-last-td">
                <DeleteOutlined
                  className="delete-icon"
                  onClick={() => {
                    setShowDeleteModal(true);
                    setSelectedUserId(id); // فقط آیدی رو تنظیم می‌کنیم
                  }}
                />
                <EditOutlined className="edit-icon" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* مودال تایید حذف */}
      <Modal
        className="container-modal"
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        footer={null} // حذف footer پیشفرض Ant
      >
        <p className="modal-text">آیا از حذف کاربر مطمئن هستید؟</p>
        <div className="modal-buttons">
          <Button
            className="cancel-button"
            onClick={() => setShowDeleteModal(false)}
          >
            انصراف
          </Button>
          <Button
            className="cancel-button" // کلاس CSS شما
            danger
            onClick={async () => {
              await removeHandler(selectedUserId);
              setShowDeleteModal(false);
              setRefreshData((prev) => !prev);
            }}
          >
            حذف
          </Button>
        </div>
      </Modal>
    </div>
  );
}
