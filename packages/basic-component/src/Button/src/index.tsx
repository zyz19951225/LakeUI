// /src/index.tsx
import React from "react";
import "./index.scoped.scss";
import sc from "../../../utils/tools";

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;

  /**
   * How large should the button be?
   */
  size?: "small" | "medium" | "large";
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({ primary = false, size = "medium", backgroundColor, label, ...props }: ButtonProps): any => {
  const mode = primary ? "storybook-button--primary" : "storybook-button--secondary";
  return (
    <button
      type="button"
      className={sc(["storybook-button", `storybook-button--${size}`, mode].join(" "))}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};
