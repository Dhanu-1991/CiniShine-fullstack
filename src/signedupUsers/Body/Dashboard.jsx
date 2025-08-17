import { useState } from "react";
import { Button, Alert, Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ sidebarOpen }) {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  const SIDEBAR_OPEN_WIDTH = 256;
  const SIDEBAR_CLOSED_WIDTH = 64;

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300 pt-24 px-4 md:px-8"
      style={{
        marginLeft: sidebarOpen ? SIDEBAR_OPEN_WIDTH : SIDEBAR_CLOSED_WIDTH,
      }}
    >
      <div className="w-full max-w-4xl mx-auto">
        {visible && (
          <Alert
            color="success"
            onDismiss={() => setVisible(false)}
            className="mb-6"
          >
            <span className="font-medium">Congrats!</span> You are signed in successfully.
          </Alert>
        )}

        <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Welcome to your dashboard. Use the tools below to manage your account.
        </p>

        <Card className="shadow-md border border-gray-200 dark:border-gray-700">
          <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
            Manage Profile
          </h5>
          <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
            Update your personal details, change your password, or adjust your preferences.
          </p>
          <Button color="blue" onClick={() => navigate("/profile")}>
            Go to Profile
          </Button>
        </Card>
      </div>
    </div>
  );
}
