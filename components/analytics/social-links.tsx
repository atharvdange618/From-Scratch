"use client";

import { Github, Instagram, Linkedin, Mail } from "@deemlol/next-icons";
import { trackSocialClick } from "@/lib/analytics";
import { X } from "lucide-react";

interface SocialLink {
  href: string;
  platform: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const socialLinks: SocialLink[] = [
  {
    href: "https://www.instagram.com/atharvdange._",
    platform: "instagram",
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: "https://x.com/atharvdangedev",
    platform: "x",
    icon: X,
    label: "X",
  },
  {
    href: "https://github.com/atharvdange618",
    platform: "github",
    icon: Github,
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/atharvdange",
    platform: "linkedin",
    icon: Linkedin,
    label: "LinkedIn",
  },
  {
    href: "mailto:atharvdange.dev@gmail.com",
    platform: "email",
    icon: Mail,
    label: "Email",
  },
];

export function SocialLinks({ location = "footer" }: { location?: string }) {
  const handleSocialClick = (platform: string) => {
    trackSocialClick(platform, location);
  };

  return (
    <div className="flex gap-2 md:gap-3">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        const isEmail = link.platform === "email";

        return (
          <a
            key={link.platform}
            href={link.href}
            {...(!isEmail && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
            onClick={() => handleSocialClick(link.platform)}
            className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-black bg-white transition-all hover:translate-y-1 hover:bg-[#FF9149]"
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{link.label}</span>
          </a>
        );
      })}
    </div>
  );
}
