const BreadcrumbItem: React.FC<{
  link: string;
  isLast: boolean;
}> = ({ link, isLast }) => (
  <>
    {!isLast ? (
      <>
        /{' '}
        <a
          href={'/' + link}
          className="my-auto text-base hover:text-orange-500"
        >
          {link}
        </a>
      </>
    ) : (
      <div>
        / <span className="text-orange-500">{link}</span>
      </div>
    )}
  </>
);

export default BreadcrumbItem;
