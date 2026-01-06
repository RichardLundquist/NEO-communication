import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, className="", ...rest }, ref) => (
  <button ref={ref} className={`... ${className} mt-3 md:mt-4 w-full py-2 px-3 border border-primary/50 bg-primary/10 hover:bg-primary/20 hover:border-primary transition-all duration-200 text-[10px] uppercase tracking-[0.2em] text-primary text-glow cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`} {...rest}>{children}</button>
));
Button.displayName = "Button";

export default Button;