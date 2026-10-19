import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import { IAuthUser } from "@/types/user";
import { getTranslations } from "@/i18n/server";

interface PublicNavbarProps {
  user: IAuthUser | null;
}

const PublicNavbar = async ({ user }: PublicNavbarProps) => {
  const nav = await getTranslations("navigation");
  const common = await getTranslations("common");
  const navItems = [
    { href: "/", label: nav("home") },
    { href: "/#about", label: nav("about") },
    { href: "/#how-it-works", label: nav("howItWorks") },
    { href: "/#features", label: nav("features") },
    { href: "/#pricing", label: nav("pricing") },
    { href: "/#faq", label: nav("faq") },
  ];

  const userRole =
    user?.role?.toLowerCase() === "super_admin"
      ? "super-admin"
      : user?.role?.toLowerCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur dark:bg-background/95">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/turf-track-logo.png"
            alt={common("brand.logoAlt")}
            width={240}
            height={44}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground font-semibold hover:text-primary hover:underline transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            <Button asChild variant="outline" className="font-semibold">
              <Link href={`/${userRole}/dashboard`}>{nav("dashboard")}</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="font-semibold">
              <Link href="/login">{nav("login")}</Link>
            </Button>
          )}
          {/* <Button asChild variant="outline" className="font-semibold">
            <Link href="/login">Login</Link>
          </Button> */}
          <Button
            asChild
            className="font-semibold bg-emerald-600 hover:bg-emerald-500 text-white border-0"
          >
            <Link href="/business/onboard">{nav("onboardYourTurf")}</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
              <SheetTitle className="sr-only">{common("navigation.menu")}</SheetTitle>
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-base font-medium text-foreground hover:text-emerald-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full font-semibold"
                  >
                    <Link href="/login">{nav("login")}</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full font-semibold bg-emerald-600 hover:bg-emerald-500 text-white border-0"
                  >
                    <Link href="/business/onboard">{nav("onboardYourTurf")}</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
