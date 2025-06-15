import { cn } from '@/lib/utils';

interface ITimelineProps {
  items: Array<ITimelineItemProps>;
}

function Timeline({ items }: ITimelineProps) {
  return (
    <div className="flex flex-col gap-8">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <TimelineItem
            key={`timeline-${index}`}
            {...item}
            showConnector={index !== items.length - 1}
            connectorStatus={isLast ? 'none' : items[index + 1].status}
          />
        );
      })}
    </div>
  );
}

interface ITimelineItemProps {
  status: 'completed' | 'none';
  label: string;
  showConnector?: boolean;
  connectorStatus?: ITimelineItemProps['status'];
}

function TimelineItem({
  status = 'none',
  label,
  showConnector = true,
  connectorStatus,
}: ITimelineItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center relative">
        <TimelineCheck status={status} />
        {showConnector && <TimelineConnector status={connectorStatus} />}
      </div>

      <div className="text-foreground">{label}</div>
    </div>
  );
}

interface ITimelineConnectorProps {
  status?: ITimelineItemProps['status'];
}

function TimelineConnector({ status = 'none' }: ITimelineConnectorProps) {
  return (
    <div
      className={cn('w-px h-8 absolute -bottom-9 left-2', {
        'bg-primary': status === 'completed',
        'bg-border': status === 'none',
      })}
    />
  );
}

interface ITimelineCheckProps {
  status?: ITimelineItemProps['status'];
}

function TimelineCheck({ status = 'none' }: ITimelineCheckProps) {
  return (
    <div
      className={cn('z-10 h-4 w-4 rounded-full border-2', {
        'border-primary bg-primary': status === 'completed',
        'border-muted bg-background': status === 'none',
      })}
    />
  );
}

export { Timeline };
