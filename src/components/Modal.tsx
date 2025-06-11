import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export type Alignment = "left" | "center" | "right";
export type PaddingSize = "sm" | "md" | "lg";
export type ModalHeight = "auto" | "90%" | "75%" | "50%" | "25%";
export type ModalWidth = "100%" | "75%" | "50%" | "40%" | "30%" | "25%";

const modalHeightClasses: Record<Exclude<ModalHeight, "auto">, string> = {
  "90%": "h-[90%]",
  "75%": "h-[75%]",
  "50%": "h-[50%]",
  "25%": "h-[25%]",
};

const modalWidthClasses: Record<ModalWidth, string> = {
  "100%": "md:w-full",
  "75%": "md:w-3/4",
  "50%": "md:w-1/2",
  "40%": "md:w-[40%]",
  "30%": "md:w-[30%]",
  "25%": "md:w-1/4",
};

const paddingClasses: Record<PaddingSize, string> = {
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
};

const horizontalPaddingClasses: Record<PaddingSize, string> = {
  sm: "px-2",
  md: "px-4",
  lg: "px-6",
};

const verticalPaddingClasses: Record<
  PaddingSize,
  { top: string; bottom: string }
> = {
  sm: { top: "pt-2", bottom: "pb-2" },
  md: { top: "pt-4", bottom: "pb-4" },
  lg: { top: "pt-6", bottom: "pb-6" },
};

export interface ModalConfig {
  headerAlignment?: Alignment;
  bodyAlignment?: Alignment;
  footerAlignment?: Alignment;
  headerPadding?: PaddingSize;
  bodyPadding?: PaddingSize;
  footerPadding?: PaddingSize;
  showHeaderSeparator?: boolean;
  showFooterSeparator?: boolean;
  height?: ModalHeight;
  width?: ModalWidth;
}

interface ModalProps {
  isOpen: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
  modalConfig?: ModalConfig;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatches = () => setMatches(media.matches);
    updateMatches();

    media.addEventListener("change", updateMatches);
    return () => media.removeEventListener("change", updateMatches);
  }, [query]);

  return matches;
}

export function Modal({
  isOpen,
  header,
  footer,
  children,
  onClose,
  showCloseButton = true,
  modalConfig,
}: ModalProps) {
  const {
    headerAlignment = "center",
    bodyAlignment = "left",
    footerAlignment = "center",
    headerPadding = "md",
    bodyPadding = "md",
    footerPadding = "md",
    showHeaderSeparator = false,
    showFooterSeparator = false,
    height = "auto",
    width = "50%",
  } = modalConfig || {};

  const isMobile = useMediaQuery("(max-width: 767px)");

  const bodyAlignClass =
    bodyAlignment === "left"
      ? "text-left"
      : bodyAlignment === "center"
      ? "text-center"
      : "text-right";

  const footerAlignClass =
    footerAlignment === "left"
      ? "text-left"
      : footerAlignment === "center"
      ? "text-center"
      : "text-right";

  // Hardcoded color values instead of CSS variables
  const headerBorderClass = showHeaderSeparator
    ? "border-b border-[#cccccc]"
    : "";
  const footerBorderClass = showFooterSeparator
    ? "border-t border-[#cccccc]"
    : "";

  const modalHeightClass =
    height === "auto"
      ? "min-h-[10%] h-auto max-h-[90%]"
      : modalHeightClasses[height as Exclude<ModalHeight, "auto">];

  const modalWidthClass = modalWidthClasses[width];

  const extraTopPadding = header
    ? ""
    : verticalPaddingClasses[headerPadding].top;
  const extraBottomPadding = footer
    ? ""
    : verticalPaddingClasses[footerPadding].bottom;

  const renderHeader = () => {
    if (!header && !showCloseButton) return null;
    if (!header) return null;
    if (headerAlignment === "center") {
      return (
        <div
          className={`relative ${headerBorderClass} ${paddingClasses[headerPadding]}`}
        >
          <div className="text-center">{header}</div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4"
            >
              <span className="text-xl font-bold">&times;</span>
            </button>
          )}
        </div>
      );
    } else if (headerAlignment === "left") {
      return (
        <div
          className={`flex items-center ${headerBorderClass} ${paddingClasses[headerPadding]}`}
        >
          <div className="flex-grow text-left">{header}</div>
          {showCloseButton && (
            <button onClick={onClose} className="text-xl font-bold ml-2">
              &times;
            </button>
          )}
        </div>
      );
    } else {
      return (
        <div
          className={`flex items-center ${headerBorderClass} ${paddingClasses[headerPadding]}`}
        >
          {showCloseButton && (
            <button onClick={onClose} className="text-xl font-bold mr-2">
              &times;
            </button>
          )}
          <div className="flex-grow text-right">{header}</div>
        </div>
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 flex items-end md:items-center md:justify-center"
          onClick={onClose}
        >
          <motion.div
            key={isMobile ? "mobile" : "desktop"} // Re-render when device changes
            initial={isMobile ? { y: "100%" } : { scale: 0.95, opacity: 0 }}
            animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
            exit={isMobile ? { y: "100%" } : { scale: 0.95, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: isMobile ? 30 : 20,
            }}
            className={`bg-[#ffffff] text-[#000000] w-full ${modalWidthClass} md:mx-0 md:rounded-lg rounded-t-lg rounded-b-none flex flex-col overflow-hidden ${modalHeightClass}`}
            onClick={(e) => e.stopPropagation()}
          >
            {renderHeader()}
            <div
              className={`flex-grow overflow-auto ${horizontalPaddingClasses[bodyPadding]} ${extraTopPadding} ${extraBottomPadding} ${bodyAlignClass}`}
            >
              {children}
            </div>
            {footer && (
              <div
                className={`${footerBorderClass} ${paddingClasses[footerPadding]} ${footerAlignClass}`}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
