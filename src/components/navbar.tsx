import Logo from "@/components/logo"
import { Button } from "@/components/ui/button-component"
import ThemeSwitch from "@/components/theme-switch"

export default function Navbar() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="max-w-[775px] mx-auto">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Main nav */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-primary hover:text-primary/90">
                <Logo />
              </a>
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeSwitch />
            <Button asChild variant="ghost" size="sm" className="text-sm">
              <a href="#">Sign In</a>
            </Button>
            <Button asChild size="sm" className="text-sm">
              <a href="#">Get Started</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}