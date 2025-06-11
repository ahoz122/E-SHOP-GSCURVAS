import React, { ButtonHTMLAttributes, useState } from "react";
import { CgSpinner } from "react-icons/cg";

// theme.ts
export const colorPalette = {
  primary: {
    base: "bg-[#155b51]",
    hover: "bg-[#124d44]",
    text: "text-white",
    border: "border-[#155b51]",
  },
  secondary: {
    base: "bg-green-500",
    hover: "bg-green-600",
    text: "text-white",
    border: "border-green-500",
  },
  outline: {
    base: "bg-transparent",
    hover: "bg-blue-100",
    text: "text-blue-500",
    border: "border-blue-500",
  },
  link: {
    base: "bg-transparent",
    hover: "underline", // En este caso se usa el hover directamente
    text: "text-blue-500",
  },
  ghost: {
    base: "bg-transparent",
    hover: "bg-gray-100",
    text: "text-gray-700",
  },
  black: {
    base: "bg-gray-900",
    hover: "bg-gray-800",
    text: "text-white",
  },
};
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "link"
  | "ghost"
  | "black";
export type ButtonSize = "sm" | "md" | "lg";
export type IconPosition = "left" | "right";
export type TextStyle =
  | "normal"
  | "bold"
  | "italic"
  | "underline"
  | "uppercase";
export type BorderRadius = "none" | "sm" | "md" | "lg" | "full";
export type BgOpacity = "none" | "low" | "medium" | "high";
export type BgBlur = "none" | "sm" | "md" | "lg";
export type PaddingOption = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  asyncOnClick?: () => Promise<void>;
  textStyle?: TextStyle;
  borderRadius?: BorderRadius;
  bgOpacity?: BgOpacity;
  bgBlur?: BgBlur;
  paddingX?: PaddingOption;
  paddingY?: PaddingOption;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  asyncOnClick,
  textStyle = "bold",
  borderRadius = "full",
  bgOpacity = "none",
  bgBlur = "none",
  paddingX = "md",
  paddingY = "sm",
  className = "",
  children,
  onClick,
  ...rest
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const effectiveLoading = loading || internalLoading;

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (effectiveLoading) {
      e.preventDefault();
      return;
    }
    if (asyncOnClick) {
      try {
        setInternalLoading(true);
        await asyncOnClick();
      } catch (error) {
        console.error(error);
      } finally {
        setInternalLoading(false);
      }
    } else if (onClick) {
      onClick(e);
    }
  };

  // Usamos el objeto de colores para definir las clases de variante
  const variantClasses: Record<ButtonVariant, string> = {
    primary: `${colorPalette.primary.base} ${colorPalette.primary.text} hover:${colorPalette.primary.hover}`,
    secondary: `${colorPalette.secondary.base} ${colorPalette.secondary.text} hover:${colorPalette.secondary.hover}`,
    outline: `${colorPalette.outline.border} ${colorPalette.outline.text} ${colorPalette.outline.base} hover:${colorPalette.outline.hover}`,
    link: `${colorPalette.link.base} ${colorPalette.link.text} hover:${colorPalette.link.hover}`,
    ghost: `${colorPalette.ghost.base} ${colorPalette.ghost.text} hover:${colorPalette.ghost.hover}`,
    black: `${colorPalette.black.base} ${colorPalette.black.text} hover:${colorPalette.black.hover}`,
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const textStyleMapping: Record<TextStyle, string> = {
    normal: "font-normal",
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    uppercase: "uppercase",
  };

  const borderRadiusMapping: Record<BorderRadius, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const bgOpacityMapping: Record<BgOpacity, string> = {
    none: "bg-opacity-100",
    low: "bg-opacity-75",
    medium: "bg-opacity-50",
    high: "bg-opacity-25",
  };

  const bgBlurMapping: Record<BgBlur, string> = {
    none: "",
    sm: "backdrop-blur-sm",
    md: "backdrop-blur",
    lg: "backdrop-blur-lg",
  };

  const pxMapping: Record<PaddingOption, string> = {
    none: "px-0",
    xs: "px-1",
    sm: "px-2",
    md: "px-4",
    lg: "px-6",
    xl: "px-8",
  };

  const pyMapping: Record<PaddingOption, string> = {
    none: "py-0",
    xs: "py-1",
    sm: "py-2",
    md: "py-4",
    lg: "py-6",
    xl: "py-8",
  };

  // Si se han proporcionado paddingX o paddingY, los usamos; si no, se aplica el tamaño por defecto
  const paddingClasses =
    paddingX || paddingY
      ? `${paddingX ? pxMapping[paddingX] : ""} ${
          paddingY ? pyMapping[paddingY] : ""
        }`.trim()
      : sizeClasses[size];

  const commonClasses = `focus:outline-none transition-colors duration-200 inline-flex items-center justify-center ${borderRadiusMapping[borderRadius]}`;
  const disabledClasses =
    effectiveLoading || disabled ? "opacity-50 cursor-not-allowed" : "";
  const widthClass = fullWidth ? "w-full" : "";
  const bgEffectClasses = [bgOpacityMapping[bgOpacity], bgBlurMapping[bgBlur]]
    .filter(Boolean)
    .join(" ");
  const dynamicStateClasses = "hover:brightness-110 active:brightness-90";

  const content = effectiveLoading ? (
    <CgSpinner className="animate-spin h-5 w-5 text-current" />
  ) : (
    <>
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      <span className={textStyleMapping[textStyle]}>{children}</span>
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </>
  );

  const buttonClasses = [
    commonClasses,
    variantClasses[variant],
    paddingClasses,
    widthClass,
    disabledClasses,
    bgEffectClasses,
    dynamicStateClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={buttonClasses}
      disabled={disabled || effectiveLoading}
      onClick={handleClick}
      {...rest}
    >
      {content}
    </button>
  );
};
