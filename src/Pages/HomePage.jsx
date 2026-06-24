import Hero from "../Components/Hero/Hero";
import HowItWorks from "../Components/HowItWorks/HowItWorks";
import Project from "../Components/Project/Project";
import FooterInfo from "../Components/FooterInfo/FooterInfo";
import Features from "../Components/Features/Features";
export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Project />
      <FooterInfo />
    </>
  );
}
