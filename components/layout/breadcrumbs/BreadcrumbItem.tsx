import Link from 'next/link';

const BreadcrumbItem: React.FC<{
  link: string;
  isLast: boolean;
}> = ({ link, isLast }) => (
  <>
    {!isLast ? (
      <>
        /{' '}
        <Link
          href={'/' + link}
          className="my-auto text-base hover:text-orange-500"
        >
          {link[0].toUpperCase() + link.slice(1, link.length)}
        </Link>
      </>
    ) : (
      <div>
        /{' '}
        <span className="text-orange-500">
          {link[0].toUpperCase() + link.slice(1, link.length)}
        </span>
      </div>
    )}
  </>
);

export default BreadcrumbItem;
