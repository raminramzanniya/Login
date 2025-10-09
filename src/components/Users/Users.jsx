import React, { useEffect, useState } from 'react'
import './Users.css'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('https://admin-p1-default-rtdb.firebaseio.com/users.json')
      const data = await res.json()
      setUsers(Object.entries(data))
    }

    fetchUsers()
  }, [])

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
