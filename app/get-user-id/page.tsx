import { auth, currentUser } from "@clerk/nextjs/server";
import { SignInButton, SignOutButton } from "@clerk/nextjs";

export default async function GetUserIdPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-none border-4 border-black bg-white p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="mb-6 font-sans text-3xl font-bold">
            Authentication Required
          </h1>
          <p className="mb-6 text-lg">
            Please sign in to view your Clerk user ID.
          </p>
          <SignInButton mode="modal">
            <button className="rounded-none border-4 border-black bg-blue-500 px-8 py-3 font-bold text-white transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-2 active:translate-y-2 [box-shadow:4px_4px_0px_0px_rgba(0,0,0,1)]">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  const user = await currentUser();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-none border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-sans text-3xl font-bold">
            Your Clerk User Information
          </h1>
          <SignOutButton>
            <button className="rounded-none border-2 border-black bg-red-500 px-4 py-2 font-bold text-white transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 [box-shadow:2px_2px_0px_0px_rgba(0,0,0,1)]">
              Sign Out
            </button>
          </SignOutButton>
        </div>

        <div className="space-y-4">
          <div className="rounded-none border-4 border-black bg-[#AFDDFF] p-4">
            <h2 className="mb-2 font-bold">User ID: </h2>
            <code className="block break-all rounded bg-black p-3 font-mono text-sm text-white">
              {userId}
            </code>
          </div>

          <div className="rounded-none border-4 border-black bg-[#E0FFF1] p-4">
            <h2 className="mb-2 font-bold">Email:</h2>
            <code className="block break-all rounded bg-black p-3 font-mono text-sm text-white">
              {user?.emailAddresses[0]?.emailAddress || "No email"}
            </code>
          </div>

          <div className="rounded-none border-4 border-black bg-[#FFECDB] p-4">
            <h2 className="mb-2 font-bold">Full Name:</h2>
            <code className="block break-all rounded bg-black p-3 font-mono text-sm text-white">
              {user?.firstName} {user?.lastName}
            </code>
          </div>
        </div>

        <div className="mt-8 rounded-none border-4 border-black bg-yellow-100 p-4">
          <h3 className="mb-2 font-bold">⚠️ Security Note:</h3>
          <p className="text-sm">
            Delete this page after copying your user ID. You only need to access
            this once to set up admin authorization.
          </p>
        </div>
      </div>
    </div>
  );
}
