
"use client";

import Link from "next/link";
import { Menu, User as UserIcon, LayoutDashboard } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirebase } from "@/firebase/provider";
import { signOut } from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Logo from "@/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#contact", label: "Contact" },
];

const Header = () => {
  const { user } = useUser();
  const { auth } = useFirebase();
  const router = useRouter();

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push("/");
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*#/, "");
    const elem = document.getElementById(targetId);

    if (elem) {
      elem?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      router.push(href);
    }
  };

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  }

  return (
    <header className="bg-background/80 shadow-sm sticky top-0 z-50 backdrop-blur-sm">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Logo />

          <div className="hidden md:flex items-center space-x-8">
            {user && (
               <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Dashboard
              </Link>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if(link.href.includes('#')) {
                    handleScroll(e)
                  }
                }}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg transform hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <Link href="/upload">Upload Paper</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                        <AvatarFallback>{getInitials(user.displayName, user.email)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Site navigation links
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-6 pt-10">
                   {user && (
                    <SheetClose asChild>
                      <Link href="/dashboard" className="text-lg text-muted-foreground hover:text-primary transition-colors duration-200 font-medium">Dashboard</Link>
                    </SheetClose>
                   )}
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                         onClick={(e) => {
                          if(link.href.includes('#')) {
                            // handleScroll(e) - sheet closes too fast
                          }
                        }}
                        className="text-lg text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="flex flex-col space-y-4 pt-6">
                    {user ? (
                      <>
                        <SheetClose asChild>
                          <Link href="/profile" className="text-lg text-muted-foreground hover:text-primary transition-colors duration-200 font-medium">My Profile</Link>
                        </SheetClose>
                        <Button onClick={handleSignOut}>Sign Out</Button>
                      </>
                    ) : (
                      <SheetClose asChild>
                          <Button asChild>
                            <Link href="/login">Get Started</Link>
                          </Button>
                        </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
