import Link from 'next/link';

const BreadcrumbItem: React.FC<{
  link: string;
  isLast: boolean;
}> = ({ link, isLast }) => {
  return (
    <>
      {!isLast ? (
        <>
          /{' '}
          <Link
            href={'/' + link}
            className="my-auto text-base hover:text-orange-500"
          >
            {link[0].toUpperCase() +
              link.slice(1, link.length).replace('_', ' ')}
          </Link>
        </>
      ) : (
        <div>
          /{' '}
          <span className="text-orange-500">
            {link[0].toUpperCase() +
              link.slice(1, link.length).replace('_', ' ')}
          </span>
        </div>
      )}
    </>
  );
};

export default BreadcrumbItem;
