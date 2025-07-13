import SideBarIcon from '@/layouts/HomePageLayout/components/SideBarIcon.tsx'
import SideBarMenu from '@/layouts/HomePageLayout/components/SideBarMenu.tsx'
import { useAppSelector } from '@/store/hooks.ts'
import clsx from 'clsx'

const SideBar = () => {
  const isCollapsed = useAppSelector(state => state.shop.isCollapsed)

  return (
    <div
      className={
        'transition-width flex h-screen min-h-screen shrink-0 flex-col overflow-hidden bg-[#353743] duration-300 ' +
        clsx({
          'w-20': isCollapsed,
          'w-50': !isCollapsed
        })
      }
    >
      <SideBarIcon />
      <SideBarMenu />
    </div>
  )
}

export default SideBar
