import AboutFooterBottom from "../Components/AboutFooterBottom/AboutFooterBottom";
import FooterInfo from "../Components/FooterInfo/FooterInfo";
import HeroAbout from "../Components/HeroAbout/HeroAbout";
import Hood from "../Components/Hood/Hood";
import Mission from "../Components/Mission/Mission";
import ProjectRecuitment from "../Components/ProjectRecuitment/ProjectRecuitment";
import Solution from "../Components/Solution/Solution";
import Vision from "../Components/Vision/Vision";

export default function AboutPage() {
    return <>
    <HeroAbout />
        <Solution />
        <Mission />
        <Hood />
        <Vision />
        <ProjectRecuitment />
        <FooterInfo />
    </>
}