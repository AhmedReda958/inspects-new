import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SocialLinks } from "./social-links";

const Sidebar = () => {
  return (
    <aside className="h-screen w-[320px] bg-primary p-6">
      <div className="h-full flex flex-col justify-start items-start gap-6">
        <Image src="/logo-full.svg" alt="logo" width={144} height={144} />
        <div className="flex flex-col gap-6 flex-1">
          <Button>
            <Link href="/">Home</Link>
          </Button>
        </div>

        <SocialLinks />
      </div>
    </aside>
  );
};

export default Sidebar;
