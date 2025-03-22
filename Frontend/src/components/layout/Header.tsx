
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, Users, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const links = [
    { href: '/', label: 'Nadzorna ploča', icon: <Home className="h-4 w-4 mr-2" /> },
    { href: '/birthdays', label: 'Rođendani', icon: <CalendarDays className="h-4 w-4 mr-2" /> },
    { href: '/birthday-boys', label: 'Slavljenici', icon: <Users className="h-4 w-4 mr-2" /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Rođendaonica
            </span>
          </Link>
        </div>

        {isMobile ? (
          <>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {isMenuOpen && (
              <div className="fixed inset-0 top-16 z-50 bg-background animate-fade-in">
                <nav className="container py-6 flex flex-col gap-4">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                        location.pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </>
        ) : (
          <>
            <nav className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors",
                    location.pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.icon}
                  {link.label}
                  {location.pathname === link.href && (
                    <div className="h-0.5 w-full bg-primary absolute bottom-0 left-0 mt-6" />
                  )}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
