import { List, ListItemButton, ListItemIcon, Typography } from '@mui/material'
import { NavLink, useLocation } from 'react-router-dom'
import {
  ChartLineIcon,
  LayoutDashboardIcon,
  ListOrderedIcon,
  MenuIcon,
  PresentationIcon,
  SatelliteDishIcon,
  UserIcon
} from 'lucide-react'
import { useAppSelector } from '@/store/hooks.ts'

const SideBarMenu = () => {
  const menuList = [
    {
      name: '工作台',
      icon: <LayoutDashboardIcon />,
      path: '/dashboard'
    },
    {
      name: '数据统计',
      icon: <ChartLineIcon />,
      path: '/statistics'
    },
    {
      name: '订单管理',
      icon: <ListOrderedIcon />,
      path: '/order'
    },

    {
      name: '套餐管理',
      icon: <PresentationIcon />,
      path: '/setmeal'
    },

    {
      name: '菜品管理',
      icon: <SatelliteDishIcon />,
      path: '/dish'
    },
    {
      name: '分类管理',
      icon: <MenuIcon />,
      path: '/category'
    },
    {
      name: '员工管理',
      icon: <UserIcon />,
      path: '/employee'
    }
  ]

  const location = useLocation()
  const isCollapsed = useAppSelector(item => item.shop.isCollapsed)

  return (
    <List
      color={'black'}
      className={'relative flex flex-col gap-5 overflow-hidden bg-[#353743] px-2'}
    >
      {menuList.map(item => (
        <ListItemButton
          selected={location.pathname.includes(item.path)}
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#E3E3E3',
              color: '#333'
            },
            '&.Mui-selected:hover': {
              backgroundColor: '#E3E3E3' // 保持 hover 时不变色
            },
            color: '#C1CBD8',
            '&:hover': {
              backgroundColor: '#4D4D4D'
            }
          }}
          to={item.path}
          component={NavLink}
          key={item.name}
          className={'h-13 flex w-full items-center gap-2 rounded py-3'}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          {!isCollapsed && <Typography className={'whitespace-nowrap'}>{item.name}</Typography>}
        </ListItemButton>
      ))}
    </List>
  )
}

export default SideBarMenu
