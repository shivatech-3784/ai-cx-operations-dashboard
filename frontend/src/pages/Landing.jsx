import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          AI CX Dashboard
        </h1>
        <p className="text-gray-500 mb-8">
          AI-powered customer experience & operations platform
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/login"
            className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="border border-indigo-600 text-indigo-600 py-2 rounded-md hover:bg-indigo-50"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
