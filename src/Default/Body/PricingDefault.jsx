import { Card, Button, Badge } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function PricingDefault() {
    console.log("PricingDefault rendered");
    const navigate = useNavigate();

    const onClickPricing=()=>{
      navigate("/signin");
    }

  return (
    <div className="bg-gray-100 mt-20 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
        Our Pricing Plans
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Basic Plan */}
        <Card className="text-center transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Basic</h3>
          <p className="text-4xl font-extrabold mt-2 text-gray-800 dark:text-gray-300">₹499</p>
          <ul className="my-4 space-y-2 text-gray-700 dark:text-gray-400">
            <li>✔ Feature 1</li>
            <li>✔ Feature 2</li>
            <li>✔ Limited Access</li>
          </ul>
          <Button onClick={onClickPricing}>Choose Plan</Button>
        </Card>

        {/* Pro Plan */}
        <Card className="text-center border-2 border-blue-500 transform hover:scale-105 transition-transform duration-300">
          <Badge color="blue" className="mb-2">Most Popular</Badge>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pro</h3>
          <p className="text-4xl font-extrabold mt-2 text-gray-800 dark:text-gray-300">₹999</p>
          <ul className="my-4 space-y-2 text-gray-700 dark:text-gray-400">
            <li>✔ All Basic Features</li>
            <li>✔ More Storage</li>
            <li>✔ Support Access</li>
          </ul>
          <Button color="blue" onClick={onClickPricing}>Choose Plan</Button>
        </Card>

        {/* Premium Plan */}
        <Card className="text-center transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Premium</h3>
          <p className="text-4xl font-extrabold mt-2 text-gray-800 dark:text-gray-300">₹1499</p>
          <ul className="my-4 space-y-2 text-gray-700 dark:text-gray-400">
            <li>✔ Everything in Pro</li>
            <li>✔ Priority Support</li>
            <li>✔ Early Access to Jobs</li>
          </ul>
          <Button color="dark" onClick={onClickPricing}>Choose Plan</Button>
        </Card>
      </div>
    </div>
  );
}
