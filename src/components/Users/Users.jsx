import React, { useEffect, useState } from 'react'
import './Users.css'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true) 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('https://admin-p1-default-rtdb.firebaseio.com/users.json')
        const data = await res.json()
        setUsers(Object.entries(data))
      } catch (err) {
        console.error("خطا در دریافت کاربران:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  return (
    <div className='container-Users'>
      <h1 className='title'>لیست کاربران</h1>
      <table>
        <thead>
          <tr>
            <th>ردیف</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(([id, user], index) => (
            <tr key={id}>
              <td>{index + 1}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
