"use client";
import { cn } from "lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";
import config from "@config/config.json"; // Import config
import Link from "next/link"; // Import Link from next/link

import React, { useRef, useState } from "react";

export const Navbar = ({ children, className, isHomepage }) => { // Accept isHomepage
  const { scrollY } = useScroll();
  const [isShrinkEffectTriggered, setIsShrinkEffectTriggered] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const navbarOffset = isHomepage ? 40 : 0; // 2.5rem = 40px

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Existing visible state logic (for shrink/blur effect)
    const visibleThreshold = 100 + navbarOffset;
    if (latest > visibleThreshold) {
      setIsShrinkEffectTriggered(true); // For shrink/blur effect
    } else {
      setIsShrinkEffectTriggered(false); // For shrink/blur effect
    }

    // New showNavbar state logic (for hide/reveal)
    const hideThreshold = 50 + navbarOffset; // Only hide after scrolling down this much from its effective top
    if (latest > lastScrollY.current && latest > hideThreshold) {
      setShowNavbar(false); // Scrolling down
    } else if (latest < lastScrollY.current || latest <= hideThreshold) {
      setShowNavbar(true); // Scrolling up or near the top
    }
    lastScrollY.current = latest;
  });

  return (
    <motion.div
      initial={{
        top: isHomepage ? "2.5rem" : "0rem",
        opacity: 1
      }}
      animate={{
        top: showNavbar ? (isHomepage ? "2.5rem" : "0rem") : "-10rem", // Animate top
        opacity: showNavbar ? 1 : 0 // Animate opacity
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }} // Applies to both top and opacity
      className={cn(
        "fixed inset-x-0 z-40 w-full overflow-hidden",
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child,
              { visible: isShrinkEffectTriggered && showNavbar }, // Pass combined prop
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "40%" : "100%",
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 170,
        damping: 26,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "relative z-10 mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start bg-transparent dark:bg-transparent px-4 py-8 lg:flex",
        visible ? "rounded-full" : "rounded-none",
        visible && "bg-gradient-to-b from-gray-200 to-gray-400",
        className
      )}
    >
      {children}
    </motion.div>
  );
};


export const NavItems = ({ items, className, onItemClick }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "hidden flex-1 flex-row items-center justify-center space-x-2 text-base font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-4 text-neutral-600 dark:text-neutral-300"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-gray-100 dark:bg-neutral-800"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 170,
        damping: 26,
      }}
      className={cn(
        "relative z-10 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-7 lg:hidden",
        visible && "bg-gradient-to-b from-gray-200 to-gray-400",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] dark:bg-neutral-950",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}) => {
  return isOpen ? (
    <IconX className="text-black dark:text-white" onClick={onClick} />
  ) : (
    <IconMenu2 className="text-black dark:text-white" onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  return (
    <Link
      href="/"
      className="relative z-50 mr-4 flex items-center space-x-2 px-2 py-4 text-sm font-normal text-foreground"
    >
      <Image
        src={config.site.logo}
        alt={config.site.title}
        width={parseInt(config.site.logo_width) || 150}
        height={parseInt(config.site.logo_height) || 39}
        className="object-contain pointer-events-none" // You might want to adjust this if aspect ratio is different
      />
      {/* The logo text is part of the SVG, so we might not need this span if the SVG includes it.
          If the SVG is just the icon, then this span is correct.
          For now, assuming the SVG is the full logo including text.
          If you want text next to an icon-only SVG, uncomment and adjust.
      <span className="font-medium text-foreground">{config.site.logo_text}</span>
      */}
    </Link>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md bg-white button bg-white text-foreground text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

  const variantStyles = {
    primary:
      "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    secondary: "bg-transparent shadow-none text-foreground",
    dark: "bg-background text-foreground shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    gradient:
      "bg-gradient-to-b from-blue-500 to-blue-700 text-foreground shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};