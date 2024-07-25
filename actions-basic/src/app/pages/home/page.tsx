import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        <main className="text-center">
          <h1 className="text-4xl font-bold text-blue-600">Welcome to My Next.js App</h1>
          <p className="mt-4 text-lg text-gray-700">This is a simple home page styled with Tailwind CSS.</p>
        </main>
      </div>
    </main>
  );
}
