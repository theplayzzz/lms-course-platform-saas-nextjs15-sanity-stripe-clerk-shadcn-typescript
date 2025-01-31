import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

function Header() {
  return (
    <div className="flex p-4 justify-between">
      <div className="flex-1">
        <Link href="/">
          <h1 className="text-2xl font-bold">Courselly</h1>
        </Link>
      </div>
      <div className="">
        <DarkModeToggle />
      </div>
    </div>
  );
}

export default Header;
