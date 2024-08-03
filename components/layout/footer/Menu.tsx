import Link from 'next/link';

interface LinkItem {
  text: string;
  href: string;
}

interface LinkItemsProps {
  title: string;
  items: LinkItem[];
}

const Menu: React.FC<LinkItemsProps> = ({ title, items }) => {
  return (
    <div className="flex w-[21%] flex-col max-md:w-full">
      <nav className="flex flex-col text-neutral-600">
        <h2 className="mb-5 text-xl font-bold">{title}</h2>
        <ul className="flex flex-col gap-1.5 text-sm font-semibold">
          {items.map((link, index) => (
            <li key={index} className="relative box-border">
              <Link className="hover:text-red-500" href={link.href}>
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
