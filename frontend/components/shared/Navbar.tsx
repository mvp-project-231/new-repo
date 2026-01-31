import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SearchIcon} from "lucide-react";

const Navbar = () => {
    return (
        <header className="flex items-center justify-between px-20 py-6 shadow-sm sticky top-0 z-10 bg-white">
               <Link href="/">
                   <p className="font-bold text-2xl" data-slot="logo">
                       ArtFlower
                   </p>
               </Link>
            <div className="flex items-center gap-2" data-slot="search">
                <Input
                    placeholder="Search for Artists"
                    type="search"
                    className="w-full outline-none focus:ring-0"
                />
                <SearchIcon className="w-6 h-6" />

            </div>
            <div className="flex items-center gap-4">
                <Button>
                    <Link href="/signup">Artist Sign Up</Link>
                </Button>
                <Button>
                    <Link href="/signin">Log In</Link>
                </Button>
            </div>
        </header>
    )
}
export default Navbar
