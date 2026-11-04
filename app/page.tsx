import { Suspense } from "react";
import GoogleButton from "@/components/buttons/google-button";

export default function Page() {
  return (
    <Suspense>
      <GoogleButton />
    </Suspense>
  );
}
