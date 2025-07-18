'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(0)

  const tutorialSteps = [
    {
      title: "Ласкаво просимо до DND-Quests! 🎮",
      content: "Перетворюйте свої щоденні завдання на епічні квести в стилі Dungeons & Dragons!",
      image: "🎯"
    },
    {
      title: "Створення квестів",
      content: "Перейдіть до 'Створити квест' щоб додати нові завдання. Виберіть складність, нагороду та категорію для вашого квесту.",
      image: "⚔️"
    },
    {
      title: "Ваш герой",
      content: "У вашому профілі ви можете подивитися свій рівень, досвід, золото та статистику. Виконуйте квести щоб підвищувати рівень!",
      image: "🛡️"
    },
    {
      title: "Друзі та співпраця",
      content: "Додавайте друзів та створюйте квести для них. Разом ви можете виконувати епічні завдання!",
      image: "🤝"
    },
    {
      title: "Готово до пригод!",
      content: "Тепер ви готові створити свій перший квест та почати свою епічну подорож!",
      image: "🚀"
    }
  ]

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/profile/tutorial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        onClose()
        setCurrentStep(0)
      }
    } catch (error) {
      console.error('Error marking tutorial as complete:', error)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">{tutorialSteps[currentStep].image}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {tutorialSteps[currentStep].title}
          </h2>
          <p className="text-gray-600">
            {tutorialSteps[currentStep].content}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Назад
          </button>

          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Завершити' : 'Далі'}
          </button>
        </div>

        {currentStep === tutorialSteps.length - 1 && (
          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Пропустити мануал
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 