import React from 'react';

interface CardProps {
  title: string;
  backgroundColor: string;
  height?: string;
}

const Card: React.FC<CardProps> = ({ title, backgroundColor, height }) => (
  <div className={`flex p-6 w-full text-2xl font-bold text-white ${backgroundColor} rounded-3xl ${height} max-md:px-5 max-md:pt-10`}>
    <span className="mt-auto">{title}</span>
  </div>
);

export default Card;