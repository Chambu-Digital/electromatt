import { useState, useEffect } from 'react'
import { useUserStore } from '@/lib/user-store'

interface Notifications {
  requests: number
  orders: number
  products: number
  customers: number
  reports: number
}

export function useNotifications() {
  const { user } = useUserStore()
  const [notifications, setNotifications] = useState<Notifications>({
    requests: 0,
    orders: 0,
    products: 0,
    customers: 0,
    reports: 0
  })
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    
    return () => clearInterval(interval)
  }, [user])

  return {
    notifications,
    loading,
    refresh: fetchNotifications
  }
}