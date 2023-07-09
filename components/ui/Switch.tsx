import dynamic from "next/dynamic";
export const Switch = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Switch"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
