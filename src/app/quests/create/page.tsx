'use client'

import { Suspense } from 'react'
import CreateQuestForm from '@/app/quests/create/CreateQuestForm'

export default function CreateQuest() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-yellow-400 mb-4">Завантаження...</h1>
        </div>
      </div>
    }>
      <CreateQuestForm />
    </Suspense>
  )
} 