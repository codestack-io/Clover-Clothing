import { Suspense } from "react";
import LoginPage from "../../../app/admin/login/page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}