import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { docsSidebar } from '@/data/docs';

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto py-6 pr-4 hidden lg:block">
      <nav className="space-y-6">
        {docsSidebar.map((section) => (
          <div key={section.title}>
            <h4 className="font-semibold text-sm mb-2">{section.title}</h4>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.slug}>
                  <NavLink
                    to={`/docs/${item.slug}`}
                    className={({ isActive }) =>
                      cn(
                        'block px-3 py-2 rounded-lg text-sm transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )
                    }
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

