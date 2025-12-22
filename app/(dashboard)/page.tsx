import Browse from "@/components/dashboard/BrowseItems";
import Homepage from "@/components/dashboard/Homepage";
import Sharing from "@/components/dashboard/SharingWorks";

export default function Home() {
  return (
    <>
      <Homepage />
      <Sharing />
      <Browse />
    </>
  );
}
