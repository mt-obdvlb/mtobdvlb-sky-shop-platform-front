import ShopStatusConfig from '@/layouts/HomePageLayout/components/ShopStatusConfig.tsx'
import UserMenu from '@/layouts/HomePageLayout/components/UserMenu.tsx'
import StatusBar from '@/layouts/HomePageLayout/components/StatusBar.tsx'

const NavBar = () => {
  return (
    <div className={'h-17 bg-primary flex w-full justify-between px-4'}>
      <StatusBar />
      <div className={'flex h-full'}>
        <ShopStatusConfig />
        <UserMenu />
      </div>
    </div>
  )
}

export default NavBar
