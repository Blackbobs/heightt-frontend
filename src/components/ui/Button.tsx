import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-base font-semibold transition-all duration-300 ease-in-out cursor-pointer font-sans no-underline',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-[oklch(36%_0.18_265)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(46,92,210,0.25)]',
        secondary: 'bg-transparent text-primary border-2 border-primary hover:bg-muted hover:-translate-y-0.5',
        outline: 'bg-transparent text-foreground border border-border hover:bg-muted hover:border-primary/40 hover:-translate-y-0.5',
      },
      size: {
        default: 'px-8 py-3.5',
        sm: 'px-6 py-2.5 text-sm',
        lg: 'px-10 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
