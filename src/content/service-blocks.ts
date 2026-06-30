/** Verified service carousel content from WP page 375 — handoff SSOT. */
import type { ServiceBlock } from "./types";

const rotateDigital = ["Web Design", "Web Dev", "Web Hosting"];
const imgAi = "/assets/portfolio/dl-portfolio-1.webp";
const imgDigital = "/assets/portfolio/dl-portfolio-2.webp";
const imgCloud = "/assets/portfolio/wto-dameluthas.webp";
const imgOrganizing = "/assets/portfolio/alu-dameluthas-1.webp";
const imgConsulting = "/assets/site/IMG_0666-2-2500px.webp";

export const serviceBlocks = [
  {
    id: "services-01",
    slide: "01/03",
    heading: "Don't Get Left Behind",
    categories: [
      {
        id: "artificial-intelligence",
        title: "Artificial Intelligence",
        eyebrow: "Don't Get Left Behind",
        image: imgAi,
        imagePosition: "left",
        rotating: [],
        items: [
          { label: "AI for Social Impact" },
          { label: "AI Hands On Training" },
          { label: "AI Agent Creation" },
          { label: "Zero to Mastery Training" },
          { label: "Image & Video Generation" },
        ],
      },
      {
        id: "digital-presence",
        title: "Digital Presence",
        image: imgDigital,
        imagePosition: "right",
        rotating: rotateDigital,
        items: [
          { label: "WordPress" },
          { label: "Search Engine Optimization (SEO)" },
          { label: "Web Applications" },
          { label: "E-Commerce" },
          { label: "WIX" },
          { label: "Shopify" },
          { label: "Sell Products on Social Media & Web" },
        ],
      },
      {
        id: "cloud-solutions",
        title: "Cloud Solutions",
        eyebrow: "Work from Anywhere",
        image: imgCloud,
        imagePosition: "right",
        rotating: [],
        items: [
          { label: "Microsoft Cloud", badge: "M365" },
          { label: "Google Cloud Platform", badge: "GCP" },
          { label: "AWS Cloud", badge: "AWS" },
          { label: "Non-Profit Cloud", badge: "CERTIFIED" },
          { label: "Migration to Cloud" },
          { label: "Multi-Cloud Solutions", badge: "HYBRID" },
          { label: "Cloud Security & Backup", badge: "CERTIFIED" },
        ],
      },
    ],
    ctaText:
      "If you're facing any technology-related challenges hindering your growth, let's talk.",
  },
  {
    id: "services-02",
    slide: "02/03",
    heading: "Non Profits & Design",
    categories: [
      {
        id: "non-profits",
        title: "Non Profits",
        image: imgOrganizing,
        imagePosition: "left",
        rotating: [],
        items: [
          { label: "Start a Nonprofit", badge: "HELP OTHERS" },
          { label: "Effective Campaigns", badge: "OUTREACH" },
          { label: "Email Marketing", badge: "AUTOMATED" },
          { label: "Fundraising Platforms" },
          { label: "Online Training", badge: "HOT" },
          { label: "Discount Programs", badge: "SAVE" },
          { label: "Donor Management", badge: "HOT" },
        ],
      },
      {
        id: "graphic-designs",
        title: "Graphic Designs",
        image: imgDigital,
        imagePosition: "right",
        rotating: [],
        items: [
          { label: "Social Media Flyers Design" },
          { label: "Print Flyers Design" },
          { label: "Business Cards Design" },
          { label: "Restaurant Menu Design" },
          { label: "Posters Design" },
          { label: "Ads Design" },
        ],
      },
    ],
    ctaText:
      "If you're facing any technology-related challenges hindering your growth, let's talk.",
  },
  {
    id: "services-03",
    slide: "03/03",
    heading: "Back to Work & Build Your Dream",
    categories: [
      {
        id: "back-to-work",
        title: "Get A Job",
        eyebrow: "Back to Work",
        image: imgConsulting,
        imagePosition: "left",
        rotating: [],
        items: [
          { label: "Customized Resumes", badge: "HOT" },
          { label: "Cover Letters", badge: "YOUR INTRO" },
          { label: "Optimize LinkedIn", badge: "SOCIAL MEDIA" },
          { label: "Create A Portfolio", badge: "ONLINE" },
        ],
      },
      {
        id: "build-your-dream",
        title: "Be Your Own Boss",
        eyebrow: "Build Your Dream",
        image: imgDigital,
        imagePosition: "right",
        rotating: [],
        items: [
          { label: "Business Plans", badge: "VISION TO CONCEPT" },
          { label: "Product Roadmaps", badge: "VISUAL JOURNEY" },
          { label: "Logo, Fonts, Colors", badge: "BRAND KIT" },
          { label: "Google Business Profile", badge: "VERIFIED" },
          { label: "Sell Your Products", badge: "GENERATE INCOME" },
          { label: "Sales Funnels", badge: "START TO FINISH" },
          { label: "Market Your Services", badge: "SOCIAL MEDIA" },
          { label: "Find Customers", badge: "ATTRACT BUSINESS" },
          { label: "Create Your Ads", badge: "MARKETING" },
        ],
      },
    ],
    ctaText:
      "If you're sure where or how to start, but refuse to give up, let's talk.",
  },
] as const satisfies readonly ServiceBlock[];
