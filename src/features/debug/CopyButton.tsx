import { useSettings } from '@/features/debug/hooks/useSettings';
import { button, useControls } from 'leva';

export default function CopyButton() {
  const { getAll } = useSettings();

  useControls({
    copy: button(() => {
      const settings = getAll();
      const formated = JSON.stringify(settings, null, 2);
      navigator.clipboard.writeText(formated);
    }),
  });

  return null;
}
