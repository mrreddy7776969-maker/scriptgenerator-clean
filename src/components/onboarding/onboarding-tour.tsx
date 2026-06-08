"use client";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { isOnboardingDone, setOnboardingDone } from "@/lib/storage";

export function OnboardingTour() {
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (!session?.user?.email) return;
    if (isOnboardingDone()) return;
    if (pathname !== "/dashboard") return;

    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        popoverClass: "plotline-tour",
        nextBtnText: "Next",
        prevBtnText: "Back",
        doneBtnText: "Get Started",
        showButtons: ["next", "previous", "close"],
        steps: [
          {
            popover: {
              title: "Welcome to PlotLine",
              description:
                "Create vivid, dialogue-free visual scripts for 3D animated kids' videos. Let's take a quick tour — you can skip anytime.",
            },
          },
          {
            element: "#nav-generator",
            popover: {
              title: "Script Generator",
              description:
                "Pick a moral theme, setting, and character count — then let AI craft a unique 10-12 scene visual script.",
            },
          },
          {
            element: "#dashboard-stats",
            popover: {
              title: "Your Usage",
              description:
                "Free users get 5 scripts. Track your remaining credits here and upgrade when you're ready.",
            },
          },
          {
            element: "#nav-billing",
            popover: {
              title: "Billing & Pricing",
              description:
                "View Pro and Pro Plus plans in Indian Rupees. Upgrade for unlimited script generation.",
            },
          },
          {
            popover: {
              title: "You're all set!",
              description:
                "Install PlotLine as an app from the top bar, pick a download folder, and start creating magical stories.",
            },
          },
        ],
        onDestroyStarted: () => {
          setOnboardingDone();
          driverObj.destroy();
        },
      });

      driverObj.drive();
    }, 2000);

    return () => clearTimeout(timer);
  }, [session, pathname]);

  return null;
}
