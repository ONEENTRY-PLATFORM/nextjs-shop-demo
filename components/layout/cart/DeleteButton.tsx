import Image from 'next/image';

const DeleteButton: React.FC = () => {
  return (
    <button
      className="relative box-border flex w-10 max-w-[40px] shrink-0 flex-col items-center justify-center"
      aria-label="Delete item"
    >
      <Image
        width={20}
        height={20}
        loading="lazy"
        src="/icons/trash.svg"
        alt="Delete"
        className="my-auto aspect-[0.8] w-4 shrink-0 fill-neutral-600"
      />
    </button>
  );
};

export default DeleteButton;
