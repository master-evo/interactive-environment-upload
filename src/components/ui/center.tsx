import { cn } from '@/lib/utils';

export default function Center({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-center w-full h-full',
        className,
      )}
      {...props}
    />
  );
}
