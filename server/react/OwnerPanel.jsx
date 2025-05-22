import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ShieldCheck, Users, LogOut } from 'lucide-react';

export default function OwnerPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/owner').then(res => res.json()).then(data => setUsers(data));
  }, []);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-6 text-gray-800"
      >
        Owner Panel
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="text-green-500" /> Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-green-600 hover:bg-green-700 transition-all">
              <Users className="mr-2" /> Manage Users
            </Button>
            <Button className="w-full bg-red-600 hover:bg-red-700 transition-all">
              <LogOut className="mr-2" /> Log Out
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="text-blue-500" /> Users Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-[400px]">
              <table className="w-full table-auto">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="p-2">ID</th>
                    <th className="p-2">Username</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-100 transition-colors">
                      <td className="p-2">{user.id}</td>
                      <td className="p-2">{user.username}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2 capitalize">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}