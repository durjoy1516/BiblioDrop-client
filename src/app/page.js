import Banner from "@/components/home/Banner";
import FeaturedBooks from "@/components/home/FeaturedBooks";
import PopularCategories from "@/components/home/PopularCategories";
import TopLibrarians from "@/components/home/TopLibrarians";

export default function Home() {
  return (
    <main className="min-h-screen theme-bg-main">
      <Banner />
      <FeaturedBooks />
      <PopularCategories />
      <TopLibrarians />
    </main>
  );
}