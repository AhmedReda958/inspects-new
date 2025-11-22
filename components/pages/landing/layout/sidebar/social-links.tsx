import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter, FaSnapchat } from "react-icons/fa6";

const socialMediaLinks = [
  {
    icon: FaXTwitter,
    href: "https://twitter.com/Inspectex_sa",
  },
  {
    icon: FaSnapchat,
    href: "https://www.snapchat.com/add/inspectex_sa?sender_web_id=8d642428-1ad2-46f9-bde9-0128354ce7dd&device_type=desktop&is_copy_url=true",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/inspectex_sa/",
  },
  {
    icon: FaFacebookF,
    href: "https://www.facebook.com/profile.php?id=61551634089888&mibextid=kFxxJD",
  },
];

export function SocialLinks() {
  return (
    <div className="w-full flex justify-center gap-4">
      {socialMediaLinks.map((link) => (
        <Button
          key={link.href}
          variant="outline"
          className="rounded-none border-white hover:text-white !bg-transparent text-white cursor-pointer"
          size={"icon"}
          asChild
        >
          <Link href={link.href} target="_blank" aria-label={link.href}>
            <link.icon className="w-5 h-5" />
          </Link>
        </Button>
      ))}
    </div>
  );
}
