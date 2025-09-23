import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter, FaSnapchat } from "react-icons/fa6";

const socialMediaLinks = [
  {
    icon: FaXTwitter,
    href: "https://www.twitter.com/inspectex",
  },
  {
    icon: FaSnapchat,
    href: "https://www.snapchat.com/inspectex",
  },

  {
    icon: FaInstagram,
    href: "https://www.instagram.com/inspectex",
  },
  {
    icon: FaFacebookF,
    href: "https://www.facebook.com/inspectex",
  },
];

export function SocialLinks() {
  return (
    <div className="w-full flex justify-center gap-4">
      {socialMediaLinks.map((link) => (
        <Button
          key={link.href}
          variant="outline"
          className="rounded-none border-white !bg-transparent text-white cursor-pointer"
          size={"icon"}
          asChild
        >
          <Link href={link.href}>
            <link.icon className="w-5 h-5" />
          </Link>
        </Button>
      ))}
    </div>
  );
}
