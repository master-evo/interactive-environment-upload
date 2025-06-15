import { Button } from '@/components/ui/button';

interface IIconButtonProps extends React.ComponentProps<'button'> {
  icon: React.ReactNode;
}

export default function IconButton({ icon, ...props }: IIconButtonProps) {
  return (
    <Button variant="ghost" size="icon" {...props}>
      {icon}
    </Button>
  );
}
