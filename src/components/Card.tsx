import React, { ReactNode } from "react";

interface CardProps {
    title?: string;
    imageUrl?: string;
    children: ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, imageUrl, children, className = "" }) => {
    return (
        <div className={`max-w-sm w-full rounded border border-gray-100 overflow-hidden shadow-xl bg-white ${className}`}>
            {imageUrl && (
                <img
                    className="w-full h-48 object-cover"
                    src={imageUrl}
                    alt={title || "Card image"}
                />
            )}
            <div className="px-4 py-4">
                {title && <div className="font-bold text-xl mb-2">{title}</div>}
                {children}
            </div>
        </div>
    );
};

export default Card;
