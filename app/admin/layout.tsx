// Toutes les pages /admin passent par la coquille protégée.
import AdminShell from '@/components/AdminShell';
export const metadata = { title: 'KORIKA Admin' };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
