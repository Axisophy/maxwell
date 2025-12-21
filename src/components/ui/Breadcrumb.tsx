import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  theme?: 'light' | 'dark';
  className?: string;
}

export default function Breadcrumb({ items, theme = 'light', className = '' }: BreadcrumbProps) {
  const textColor = theme === 'dark' ? 'text-white/40' : 'text-black/50';
  const hoverColor = theme === 'dark' ? 'hover:text-white/70' : 'hover:text-black';
  const currentColor = theme === 'dark' ? 'text-white/60' : 'text-black/70';

  return (
    <nav className={`font-mono text-xs uppercase tracking-widest ${className}`}>
      <ol className="flex items-center gap-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {index > 0 && (
              <span className={textColor}>/</span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={`${textColor} ${hoverColor} transition-colors`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={currentColor}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
