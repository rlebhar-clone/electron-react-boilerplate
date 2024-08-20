import { cn } from '@/renderer/libs/utils';
import { Loader } from 'lucide-react';
import { forwardRef, HTMLAttributes } from 'react';

const spinnerVariants = 'w-4 h-4 rounded-full animate-spin';

interface LoadingSpinnerProps extends HTMLAttributes<SVGSVGElement> {
  className?: string;
}

const LoadingSpinner = forwardRef<SVGSVGElement, LoadingSpinnerProps>(
  (props, ref) => {
    const { className, ...rest } = props;
    return (
      <Loader ref={ref} className={cn(spinnerVariants, className)} {...rest} />
    );
  },
);

LoadingSpinner.displayName = 'LoadingSpinner';

export { LoadingSpinner };
