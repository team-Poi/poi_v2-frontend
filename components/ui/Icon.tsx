import dynamic from "next/dynamic";

export const Icon = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Icon"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
