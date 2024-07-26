import React from 'react';

interface SymbolCardProps {
  // Add any specific props here if needed
}

const GroupItem: React.FC<SymbolCardProps> = () => {
  return (
    <article className="box-border flex relative flex-col shrink-0">
      {/* Content of the Symbol component */}
    </article>
  );
};

const NavGroup: React.FC = () => {
  const symbolCards = [1, 2, 3];

  return (
    <section className="flex gap-5 my-auto max-md:flex-wrap max-md:max-w-full">
      {symbolCards.map((_, index) => (
        <GroupItem key={index} />
      ))}
    </section>
  );
};

export default NavGroup;