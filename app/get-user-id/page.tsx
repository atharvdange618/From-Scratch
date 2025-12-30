import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function GetUserIdPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-none border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-6 font-sans text-3xl font-bold">
          Your Clerk User Information
        </h1>

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
