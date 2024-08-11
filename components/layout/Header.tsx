// import { getMenusByMarker } from '../api/serverSideProps';
import { menuItems } from '../data';
import Logo from './header/Logo';
import NavGroup from './header/NavGroup';
import SearchBar from './header/SearchBar';

const Header: React.FC = async () => {
  // const menu = await getMenusByMarker('user_web', 'en_US');
  // console.log(menu);
  return (
    <header className="flex items-center justify-center border border-solid border-neutral-100 bg-white px-5 max-md:px-5">
      <section
        className="
          mx-auto box-border flex w-full 
          max-w-screen-xl grow 
          flex-col 
          justify-center
          self-stretch 
          bg-white 
          max-md:px-5 
          md:py-6 
          lg:py-10
        "
      >
        <div className="flex w-full max-w-screen-xl justify-between gap-6 max-md:flex-wrap">
          <Logo />
          <SearchBar />
          <NavGroup menuItems={menuItems} />
        </div>
      </section>
    </header>
  );
};

export default Header;
