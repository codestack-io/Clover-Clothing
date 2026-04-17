import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";

export default async function MyAccount() {

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-xl mx-auto mt-20 bg-white shadow p-6 rounded">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      <p>
        <span className="font-semibold">Name:</span> {session.user.name}
      </p>

      <p>
        <span className="font-semibold">Email:</span> {session.user.email}
      </p>
    </div>
  );
}