import React from 'react'
import { useTranslation } from 'react-i18next'

const RolesandPermission = () => {
  const { t } = useTranslation(['roles', 'common']);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('title', { ns: 'roles' })}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {t('description', { ns: 'roles' })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RolesandPermission