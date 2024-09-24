import Image from 'next/image';

const Placeholder = () => {
  return (
    <div className="relative flex size-full flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-50">
      <Image
        fill
        sizes="(min-width: 600px) 50vw, 100vw"
        src={'/images/logo-250x70.svg'}
        alt={'OneEntry'}
        className="mx-auto size-full max-w-[60%]"
      />
    </div>
  );
};

export default Placeholder;
