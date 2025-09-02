import React from 'react'
import Header from '../../../components/Header'

const RolesandPermission = () => {

  return (
    <div className="space-y-4">
      <Header 
        handleRefresh={() => {}}
        isRefreshing={false}
        handleExport={() => {}}
        tableData={[]}
        ns="roles"
      />
    </div>
  )
}

export default RolesandPermission