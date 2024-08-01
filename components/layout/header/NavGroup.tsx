import React from "react";
import NavGroupItem from "./NavGroupItem";

const items = [
  {
    icon: "/icons/user.svg",
    href: "#",
    title: "user",
  },
  {
    icon: "/icons/heart.svg",
    href: "#",
    title: "heart",
  },
  {
    icon: "/icons/cart.svg",
    href: "#",
    title: "cart",
  },
];

const NavGroup: React.FC = () => {
  return (
    <div className="flex gap-5 my-auto max-md:max-w-full">
      {items.map((item, index) => (
        <NavGroupItem key={index} item={item} />
      ))}
    </div>
  );
};

export default NavGroup;
