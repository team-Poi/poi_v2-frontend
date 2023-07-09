import dynamic from "next/dynamic";

export const Conatiner = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Container"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
