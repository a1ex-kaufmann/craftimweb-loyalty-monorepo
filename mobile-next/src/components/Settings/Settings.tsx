import { motion } from 'framer-motion'
import { Phone, User, Mail, Calendar, LogOut } from 'lucide-react'
import { useState } from 'react'

interface UserData {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
}

export const Settings = () => {
  const [userData, setUserData] = useState<UserData>({
    firstName: 'Иван',
    lastName: 'Иванов',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    birthDate: '1990-01-01'
  })

  const handleChange = (field: keyof UserData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = () => {
    alert('Настройки сохранены!')
  }

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      // Здесь будет логика выхода
      alert('Вы вышли из системы')
    }
  }

  return (
    <motion.div 
      className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6"
    //   initial={{ opacity: 0.5, y: 10 }}
    //   animate={[{ opacity: 1, y: 0 }]}
    //   transition={{ duration: 0.1 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Профиль</h2>
        <div className="flex items-center text-gray-600">
          <Phone size={20} className="mr-2" />
          <span>{userData.phone}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm text-gray-600 mb-2">
              <User size={18} className="mr-2" />
              Имя
            </label>
            <input
              type="text"
              value={userData.firstName}
              onChange={handleChange('firstName')}
              className="w-full p-3 border rounded-xl bg-gray-50 text-black"
            />
          </div>
          <div>
            <label className="flex items-center text-sm text-gray-600 mb-2">
              <User size={18} className="mr-2" />
              Фамилия
            </label>
            <input
              type="text"
              value={userData.lastName}
              onChange={handleChange('lastName')}
              className="w-full p-3 border rounded-xl bg-gray-50 text-black"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center text-sm text-gray-600 mb-2">
            <Mail size={18} className="mr-2" />
            Email
          </label>
          <input
            type="email"
            value={userData.email}
            onChange={handleChange('email')}
            className="w-full p-3 border rounded-xl bg-gray-50 text-black"
          />
        </div>

        <div>
          <label className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar size={18} className="mr-2" />
            Дата рождения
          </label>
          <input
            type="date"
            value={userData.birthDate}
            onChange={handleChange('birthDate')}
            className="w-full p-3 border rounded-xl bg-gray-50 text-black"
          />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <motion.button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Сохранить изменения
        </motion.button>

        <motion.button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={20} className="mr-2" />
          Выйти
        </motion.button>
      </div>
    </motion.div>
  )
} 