import clsx from 'clsx';

interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'solid' | 'outline';
}

export function Badge({ label, color, variant = 'solid' }: BadgeProps) {
  if (variant === 'outline') {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border"
        style={{
          color: color ?? 'currentColor',
          borderColor: color ? `${color}40` : 'currentColor',
          backgroundColor: color ? `${color}10` : 'transparent',
        }}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full',
      )}
      style={{
        backgroundColor: color ? `${color}20` : undefined,
        color: color ?? 'currentColor',
      }}
    >
      {label}
    </span>
  );
}
