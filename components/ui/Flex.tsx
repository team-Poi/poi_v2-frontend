import dynamic from "next/dynamic";

export const Flex = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Flex"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
