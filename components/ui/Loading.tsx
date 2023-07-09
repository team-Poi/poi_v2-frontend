import dynamic from "next/dynamic";

export const Loading = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Loading"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
