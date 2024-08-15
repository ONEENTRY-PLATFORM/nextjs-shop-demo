import NavItemCart from './NavItemCart';
import NavItemFavorites from './NavItemFavorites';
import NavItemProfile from './NavItemProfile';

const NavGroup: React.FC = () => {
  return (
    <div className="my-auto flex gap-5 max-md:max-w-full">
      <NavItemProfile />
      <NavItemFavorites />
      <NavItemCart />
    </div>
  );
};

export default NavGroup;
