import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "#1d3494" }}
        >
          <LayoutDashboard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to Lee Digital
        </h2>
        <p className="text-gray-500 leading-relaxed">
          Your CRM &amp; Billing workspace is ready. Use the sidebar to navigate
          between modules.
        </p>
      </div>
    </div>
  );
}
