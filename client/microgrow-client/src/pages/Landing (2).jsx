import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900">MicroGrow</h1>
      <p className="mt-3 max-w-md text-slate-500">
        Turn your stolen lecture time into real CS skill — one 5-minute session at a time.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/register"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Get started
        </Link>
        <Link
          to="/login"
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Landing;
