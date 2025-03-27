
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight,
  LineChart
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    href: "/admin" 
  },
  { 
    icon: Package, 
    label: "Products", 
    href: "/admin/products" 
  },
  { 
    icon: ShoppingBag, 
    label: "Orders", 
    href: "/admin/orders" 
  },
  { 
    icon: Users, 
    label: "Users", 
    href: "/admin/users" 
  },
  { 
    icon: LineChart, 
    label: "Recommendations", 
    href: "/admin/recommendations" 
  },
  { 
    icon: Settings, 
    label: "Settings", 
    href: "/admin/settings" 
  }
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive"
      });
    }
  };

  return (
    <aside className="hidden border-r bg-background lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block lg:w-72 lg:pb-4">
      <div className="flex h-full flex-col">
        <div className="border-b px-6 py-4">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/63521127-b685-4b09-be8f-970b73ceb65f.png" 
              alt="GadgetHub Logo" 
              className="h-6 w-auto object-contain mix-blend-multiply dark:mix-blend-screen"
            />
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {sidebarLinks.map((link, index) => {
              const isActive = location.pathname === link.href;
              const Icon = link.icon;
              
              return (
                <Link
                  key={index}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto border-t px-6 py-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
};
