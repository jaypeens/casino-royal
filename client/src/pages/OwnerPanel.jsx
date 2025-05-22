
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function OwnerPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/owner', { withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white p-6 font-sans">
      <motion.h1
        className="text-4xl font-bold text-yellow-400 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🎰 Owner Panel
      </motion.h1>

      <motion.div
        className="bg-neutral-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="bg-neutral-700 text-yellow-300 text-sm">
              <th className="p-2">ID</th>
              <th className="p-2">Email</th>
              <th className="p-2">Username</th>
              <th className="p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-neutral-600 hover:bg-neutral-700">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.username}</td>
                <td className="p-2 capitalize text-yellow-400">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
