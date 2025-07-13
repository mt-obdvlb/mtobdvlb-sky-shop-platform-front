import NavBar from '@/layouts/HomePageLayout/components/NavBar.tsx'
import SideBar from '@/layouts/HomePageLayout/components/SideBar.tsx'
import { Outlet } from 'react-router-dom'

const HomePageLayout = () => {
  return (
    <div className="max-w-screen flex h-screen w-screen">
      <SideBar />
      <div className={'flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300'}>
        <NavBar />
        <div className={'flex-1 overflow-y-auto bg-[#F3F4F7]'}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default HomePageLayout
