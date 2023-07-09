import dynamic from "next/dynamic";

export const FullFlex = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/FullFlex"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
