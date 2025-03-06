
import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
}

export const AdminLayout = ({ 
  children, 
  title, 
  subtitle,
  isLoading = false,
  breadcrumbs,
  action
}: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title={title} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 lg:pl-72">
          <div className="px-4 py-6 md:px-6 md:py-8">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-4">
                <nav className="flex">
                  <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {breadcrumbs.map((item, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <span>/</span>}
                        <li>
                          {item.href ? (
                            <a href={item.href} className="hover:text-foreground">
                              {item.label}
                            </a>
                          ) : (
                            <span className={index === breadcrumbs.length - 1 ? "font-medium text-foreground" : ""}>
                              {item.label}
                            </span>
                          )}
                        </li>
                      </React.Fragment>
                    ))}
                  </ol>
                </nav>
                <Separator className="mt-2.5" />
              </div>
            )}
            
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
              </div>
              {action && <div>{action}</div>}
            </div>
            
            {isLoading ? (
              <div className="flex h-[50vh] items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
