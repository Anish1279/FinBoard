import { type ReactNode } from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 text-gray-300 dark:text-gray-600">
        {icon ?? <SearchX size={48} strokeWidth={1.5} />}
      </div>
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-500 max-w-sm mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
