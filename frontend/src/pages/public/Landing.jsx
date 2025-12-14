import Hero from "../../components/ui/Hero";
import CompanyBanner from "../../components/ui/CompanyBanner";
import Features from "../../components/ui/Features";

const Landing = () => {
  return (
    <div className="w-full">
      <Hero />
      <CompanyBanner />
      <Features />
    </div>
  );
};

export default Landing;
