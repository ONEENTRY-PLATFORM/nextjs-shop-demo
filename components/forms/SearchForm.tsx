const SearchForm: React.FC = () => {
  return (
    <form className="flex min-h-full flex-col gap-4 text-xl leading-5">
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="max-w-full text-xl font-bold text-neutral-600">
          Sign in
        </h2>
        <p className="max-w-full text-xs text-gray-400">E-mail/Phone</p>
      </div>
    </form>
  );
};

export default SearchForm;
