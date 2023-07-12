import { Button } from "@team.poi/ui";
import { useRouter } from "next/router";
import Errors from "@/components/error";

export default function Error() {
  const router = useRouter();
  return (
    <>
      <Errors
        title="No shortened link found"
        bigTitle="Uhh.. There is no link for $i."
        smallTitle="Or reached the max usage count, or expired..."
        button={
          <>
            But you can{" "}
            <Button color="INFO" bordered onClick={() => router.push("/share")}>
              shorten
            </Button>{" "}
            your own links!
          </>
        }
      />
    </>
  );
}
