"use client";

import Logo from "@/components/logo"
import { Button } from "@/components/ui/button-component"
import ThemeSwitch from "@/components/theme-switch"
import UserMenu from "@/components/user-menu"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { useAuth } from "@/hooks/useAuth"
import { HelpCircle } from "lucide-react"

export default function Navbar() {
  const { user, isLoading } = useAuth();

  return (
    <header className="border-b px-4 md:px-6">
      <div className="max-w-[775px] mx-auto">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Main nav */}
            <div className="flex items-center gap-6">
              <a href="/" className="text-primary hover:text-primary/90" aria-label="Home">
                <Logo />
              </a>
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeSwitch />
            
            {!isLoading && (
              <>
                {user ? (
                  // Authenticated user UI
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {/* Info menu */}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                      {/* Notification */}
                      <NotificationsDropdown />
                    </div>
                    {/* User menu */}
                    <UserMenu />
                  </div>
                ) : (
                  // Guest user UI
                  <>
                    <Button asChild variant="ghost" size="sm" className="text-sm">
                      <a href="/auth">Sign In</a>
                    </Button>
                    <Button asChild size="sm" className="text-sm">
                      <a href="/auth?tab=signup">Get Started</a>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}