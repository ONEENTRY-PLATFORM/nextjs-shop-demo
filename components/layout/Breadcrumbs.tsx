import React from "react";
import BackButton from "./breadcrumbs/BackButton";
import BreadcrumbsTrail from "./breadcrumbs/BreadcrumbsTrail";

const breadcrumbItems = [
  { 
    text: "Home",
    href: "/", 
  },
  { 
    text: "Catalogue",
    href: "/catalogue", 
  },
  { 
    text: "Soft toys",
    href: "/catalogue/soft-toys/", 
  },
  { 
    text: "Grey Ninja",
    href: "/catalogue/soft-toys/grey-ninja",
  },
];

const Breadcrumbs: React.FC = () => (
  <section
    className="
      box-border flex flex-col grow 
      justify-center self-stretch 
      px-5 py-2 mx-auto 
      w-full 
      bg-white 
      border border-solid border-neutral-100
    "
  >
    <div
      className="
      flex flex-col justify-center 
      mx-auto w-full max-w-[1240px] 
    "
    >
      <div className="flex gap-5 mr-auto">
        <BackButton />
        <BreadcrumbsTrail items={breadcrumbItems} />
      </div>
    </div>
  </section>
);

export default Breadcrumbs;
