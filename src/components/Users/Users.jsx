import React, { useEffect, useState } from "react";
import "./Users.css";
import { Modal, Button, Form, Input, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function Users() {
  // state ها
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [refreshData, setRefreshData] = useState(false);

  // فرم کنترل
  const [form] = Form.useForm();

  // fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://admin-p1-default-rtdb.firebaseio.com/users.json"
        );
        const data = await res.json();
        if (data) setUsers(Object.entries(data)); // [id, userObj]
        else setUsers([]);
      } catch (err) {
        console.error("خطا در دریافت کاربران:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [refreshData]);

  // حذف کاربر
  const removeHandler = async (userId) => {
    try {
      const res = await fetch(
        `https://admin-p1-default-rtdb.firebaseio.com/users/${userId}.json`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("خطا در حذف کاربر");
      message.success("کاربر حذف شد");
      // رفرش لیست
      setRefreshData((p) => !p);
    } catch (err) {
      console.error(err);
      message.error("حذف موفق نبود");
    }
  };

  // عملکرد submit فرم ویرایش
  const onFinish = async (values) => {
    // values: { firstName, lastName, email } (از name های Form.Item)
    try {
      const res = await fetch(
        `https://admin-p1-default-rtdb.firebaseio.com/users/${selectedUserId}.json`,
        {
          method: "PATCH", // PATCH برای آپدیت جزئی مناسب است
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (!res.ok) throw new Error("خطا در ویرایش کاربر");
      message.success("ویرایش با موفقیت انجام شد");
      setShowEditModal(false);
      form.resetFields();
      setRefreshData((p) => !p);
    } catch (err) {
      console.error(err);
      message.error("ویرایش موفق نبود");
    }
  };

  // حالت لودینگ
  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

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
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td className="action-last-td">
                <DeleteOutlined
                  className="delete-icon"
                  onClick={() => {
                    setShowDeleteModal(true);
                    setSelectedUserId(id);
                  }}
                />
                <EditOutlined
                  className="edit-icon"
                  onClick={() => {
                    // باز کردن مودال و مقداردهی فرم براساس کاربر انتخابی
                    setSelectedUserId(id);
                    form.setFieldsValue({
                      firstName: user.firstName || "",
                      lastName: user.lastName || "",
                      email: user.email || "",
                    });
                    setShowEditModal(true);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* مودال حذف */}
      <Modal
        className="container-modal"
        open={showDeleteModal} // در AntD از prop "open" استفاده می‌کنیم
        onCancel={() => setShowDeleteModal(false)}
        footer={null}
      >
        <p className="modal-text">آیا از حذف کاربر مطمئن هستید؟</p>
        <div className="modal-buttons">
          <Button className="cancel-button" onClick={() => setShowDeleteModal(false)}>
            انصراف
          </Button>
          <Button
            className="cancel-button"
            danger
            onClick={async () => {
              await removeHandler(selectedUserId);
              setShowDeleteModal(false);
            }}
          >
            حذف
          </Button>
        </div>
      </Modal>

      {/* مودال ویرایش */}
      <Modal
        title="ویرایش کاربر"
        open={showEditModal} // باید open باشه نه show
        onCancel={() => {
          setShowEditModal(false);
          form.resetFields();
        }}
        footer={null}
      >
        {/* از Form.Item (نه MyFormItem) استفاده کن */}
        <Form form={form} name="edit_user" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="firstName"                // ← این همان name ای است که قبلاً خطا می‌دادی
            label="First Name"
            rules={[{ required: true, message: "نام را وارد کنید" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "نام خانوادگی را وارد کنید" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "ایمیل را وارد کنید" },
              { type: "email", message: "فرمت ایمیل صحیح نیست" },
            ]}
          >
            <Input />
          </Form.Item>

          <div className="modal-buttons" >
            <Button className="cancel-button" onClick={() => { setShowEditModal(false); form.resetFields(); }}>
              انصراف
            </Button>
            <Button className="cancel-button" type="primary" htmlType="submit">
              ذخیره
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
