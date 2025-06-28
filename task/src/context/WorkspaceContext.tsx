
import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

type Workspace = {
  _id: string
  workspacename: string
  picture: string
  teammembers: TeamMember[]
}
type TeamMember={
  _id:string,
  name:string,
}
type WorkspaceContextType = {
  workspaces: Workspace[]
  selectedWorkspace: Workspace | null
  setSelectedWorkspace: (ws: Workspace) => void
  refreshWorkspaces: () => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)

  const refreshWorkspaces = async () => {
    const response = await axios.get('http://localhost:3000/work/workspaces', { withCredentials: true })
    const data = response.data.data
    setWorkspaces(data)

    const storedId = localStorage.getItem('selectedWorkspaceId')
    const matched = storedId ? data.find((ws: Workspace) => ws._id === storedId) : null
    setSelectedWorkspace(matched || data[0] || null)
  }

  useEffect(() => {
    refreshWorkspaces()
  }, [])

  useEffect(() => {
    if (selectedWorkspace) {
      localStorage.setItem('selectedWorkspaceId', selectedWorkspace._id)
    }
  }, [selectedWorkspace])

  return (
    <WorkspaceContext.Provider value={{ workspaces, selectedWorkspace, setSelectedWorkspace, refreshWorkspaces }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}
