import dynamic from "next/dynamic";

export const Saero = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Column"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
