import Image from "next/image";
import { SocialLinks } from "./social-links";
import { Navigation } from "./navigation";

const Sidebar = () => {
  return (
    <aside className="hidden lg:block h-screen w-full lg:w-[340px] bg-primary p-6">
      <div className="h-full flex flex-col justify-start items-start gap-6">
        <Image
          src="/logo-full-dark.svg"
          alt="logo"
          width={144}
          height={144}
          className="lg:w-36 lg:h-36 w-28 h-28 -ms-4 mb-4"
        />
        <Navigation />
        <SocialLinks />
      </div>
    </aside>
  );
};

export default Sidebar;
