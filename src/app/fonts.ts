import { Cardo, Outfit } from "next/font/google";

export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const cardo = Cardo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cardo",
  display: "swap",
});
