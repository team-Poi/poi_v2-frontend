import dynamic from "next/dynamic";

export const Garo = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Row"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
