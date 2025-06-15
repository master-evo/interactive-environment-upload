import { cn } from '@/lib/utils';

export default function Container({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('container mx-auto px-4 h-screen', className)}
      {...props}
    />
  );
}
