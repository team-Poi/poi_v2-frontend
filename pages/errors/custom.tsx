import { Button } from "@team.poi/ui";
import { useRouter } from "next/router";
import Errors from "@/components/error";

export default function Error() {
  const router = useRouter();
  return (
    <Errors
      title="No customized path link found"
      bigTitle="Uhh.. There is no customized path link for $i."
      smallTitle="Or reached the max usage count, or expired..."
      button={
        <>
          But you can make your own{" "}
          <Button
            color="INFO"
            bordered
            onClick={() => router.push("/share/custom")}
          >
            customized path links!
          </Button>
        </>
      }
    />
  );
}
