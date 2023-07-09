import dynamic from "next/dynamic";

export const Input = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Input"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
