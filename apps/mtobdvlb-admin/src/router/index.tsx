import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import App from '@/App.tsx'
import HomePageLayout from '@/layouts/HomePageLayout'
import DashBoard from '@/pages/DashBoard'
import Setmeal from '@/pages/Setmeal'
import Order from '@/pages/Order'
import Employee from '@/pages/Employee'
import Statistics from '@/pages/Statistics'
import Dish from '@/pages/Dish'
import RouteGuard from '@/components/RouteGuard.tsx'
import Category from '@/pages/Category'
import EmployeeAdd from '@/pages/Employee/Add'
import DishAdd from '@/pages/Dish/Add'
import SetmealAdd from '@/pages/Setmeal/Add'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Navigate to="/" replace />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '',
        element: (
          <RouteGuard>
            <HomePageLayout />
          </RouteGuard>
        ),
        children: [
          {
            path: 'dashboard',
            element: <DashBoard />
          },
          {
            path: 'setmeal',
            element: <Setmeal />
          },
          {
            path: 'order',
            element: <Order />
          },
          {
            path: 'employee',
            element: <Employee />
          },
          {
            path: 'statistics',
            element: <Statistics />
          },
          {
            path: 'dish',
            element: <Dish />
          },
          {
            path: 'category',
            element: <Category />
          },
          {
            path: 'employee/add',
            element: <EmployeeAdd />
          },
          {
            path: 'dish/add',
            element: <DishAdd />
          },
          {
            path: 'setmeal/add',
            element: <SetmealAdd />
          }
        ]
      }
    ]
  }
])
export default router
