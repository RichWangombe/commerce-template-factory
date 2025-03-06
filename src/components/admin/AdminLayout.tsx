
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title={title} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 lg:pl-72">
          <div className="px-4 py-6 md:px-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
