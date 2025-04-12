"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/auth-context";
import { Bell, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-16 md:h-20" />;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex w-full h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">Utsabkotha</span>
          </Link>

          <nav className="hidden md:flex ml-10 space-x-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/events"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Events
            </Link>
            {user?.role === "organizer" && (
              <Link
                href="/events/manage"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Manage Events
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {!isLoading && user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {[
                    "Your event registration for 'AI Workshop' is confirmed",
                    "New volunteer opportunity available",
                    "Reminder: 'Data Science Conference' starts tomorrow",
                  ].map((notification, index) => (
                    <DropdownMenuItem
                      key={index}
                      className="py-3 cursor-pointer"
                    >
                      {notification}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge variant="outline" className="mt-1 w-fit">
                        {user.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/tickets">My Tickets</Link>
                  </DropdownMenuItem>
                  {user.role === "organizer" && (
                    <DropdownMenuItem asChild>
                      <Link href="/events/create">Create Event</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>DIU Event Hub</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4">
                <Link
                  href="/"
                  className="text-base font-medium hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/events"
                  className="text-base font-medium hover:text-primary transition-colors"
                >
                  Events
                </Link>
                {user?.role === "organizer" && (
                  <Link
                    href="/events/manage"
                    className="text-base font-medium hover:text-primary transition-colors"
                  >
                    Manage Events
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-base font-medium hover:text-primary transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                {!user && (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      Register
                    </Link>
                  </>
                )}
                {user && (
                  <>
                    <Link
                      href="/profile"
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/profile/tickets"
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      My Tickets
                    </Link>
                    <button
                      onClick={logout}
                      className="text-base font-medium text-left hover:text-primary transition-colors"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
