import React from 'react'
import { ArrowLeft, Edit, Plus, X } from "lucide-react"
import { User } from "lucide-react"
import UserSettingsCard from './user-settings-card'

interface ProfileSettingsProps {
  onClose: () => void
}

export default function ProfileSettings({ onClose }: ProfileSettingsProps) {


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 px-[25vh]">
      <div className="bg-[#2C2436] text-white p-10 rounded-3xl w-full overflow-y-auto">
        <header className="flex items-center mb-6">
          <button onClick={onClose} className="mr-4" aria-label="Volver">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Ajustes de Perfil</h1>
        </header>
        
        <div className="flex justify-center items-center">
          {/* User Card */}
          <UserSettingsCard/>
          {/* User Card */}
        </div>
      </div>
    </div>
  )
}