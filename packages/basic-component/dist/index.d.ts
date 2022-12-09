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
declare const Button: ({ primary, size, backgroundColor, label, ...props }: ButtonProps) => JSX.Element;

interface User {
  name: string;
}
interface HeaderProps {
  user?: User;
  onLogin: () => void;
  onLogout: () => void;
  onCreateAccount: () => void;
}
declare const Header: ({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) => JSX.Element;

export { Button, Header };
