// app/not-found.jsx
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-xl text-gray-600">Short link not found</p>
        <a href="/" className="mt-6 inline-block text-indigo-600 hover:underline">
          ← Back to TinyLink
        </a>
      </div>
    </div>
  );
}