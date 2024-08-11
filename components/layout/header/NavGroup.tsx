import NavGroupItem from './NavGroupItem';

interface MenuItemsProps {
  menuItems: [];
}
const NavGroup: React.FC<MenuItemsProps> = ({ menuItems }) => {
  return (
    <div className="my-auto flex gap-5 max-md:max-w-full">
      {menuItems?.map((item, index) => (
        <NavGroupItem key={index} item={item} />
      ))}
    </div>
  );
};

export default NavGroup;
