import React from "react";
import BackButton from "./breadcrumbs/BackButton";
import BreadcrumbsTrail from "./breadcrumbs/BreadcrumbsTrail";

const breadcrumbItems = [
  { href: "#", text: "Home" },
  { href: "#", text: "Catalogue" },
  { href: "#", text: "Soft toys" },
  { href: "#", text: "Grey Ninja" },
];

const Breadcrumbs: React.FC = () => (
  <section
    className="
    box-border 
    flex 
    flex-col 
    grow 
    justify-center 
    self-stretch 
    px-5 
    py-2 
    mx-auto 
    w-full 
    bg-white 
    max-md:px-5 
    border 
    border-solid 
    border-neutral-100
  "
  >
    <div
      className="
      flex 
      flex-col 
      justify-center 
      mx-auto 
      w-full 
      max-w-[1240px] 
      max-md:ml-2.5
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
