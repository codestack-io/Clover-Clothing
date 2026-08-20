import DashboardLayout from "../../components/Dashboard/DashboardLayout";

export const metadata = {
  title: "Admin Dashboard | Clover Clothing",
  description: "Manage products, orders, customers, and more.",
};

export default function DashboardRootLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}