import { Link } from "react-router-dom";

export default function NotFound() {

  return (

    <div className="min-h-screen flex items-center justify-center bg-dark px-6">

      <div className="text-center">

        <h1 className="text-8xl font-bold text-secondary">
          404
        </h1>

        <h2 className="text-3xl font-bold mt-4">
          Page Not Found
        </h2>

        <p className="text-gray-400 mt-4">
          The blockchain page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="inline-block mt-8 bg-secondary text-black px-8 py-4 rounded-2xl font-semibold"
        >
          Back Home
        </Link>

      </div>

    </div>
  );
}