import Link from "next/link";
import Image from "next/image";

const Logo: React.FC = () => {
  return (
    <Link href="/" prefetch={true} className="relative w-full max-w-[300px] h-[80px]">
      <Image
        className="object-contain"
        fill
        alt={""}
        src={"/images/logo-300x80.svg"}
        priority={true}
      />
    </Link>
  );
};

export default Logo;
