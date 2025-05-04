
import Link from "next/link";

export default function Home() {
  return (
  <>
  <div className="flex flex-col items-center justify-center min-h-screen py-2">
  <h1> Welcome To Auth App  </h1>
  


   <button  className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black">
    <Link href="/login">
      Login
    </Link>
    </button>
   <button className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black">
   <Link href="/signup">
    signup
    </Link>
   </button>
 </div>
   </>
  );
}
