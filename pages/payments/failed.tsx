import { useRouter } from "next/router";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div>
      <h1>결제 실패</h1>
      <div>{`사유: ${router.query["message"]}`}</div>
    </div>
  );
}
