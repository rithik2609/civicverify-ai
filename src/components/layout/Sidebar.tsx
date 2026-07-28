import Link from "next/link";
import {
    LayoutDashboard,
    Search,
    FileText,
    Network,
    ShieldCheck,
    Settings,
} from "lucide-react";

const menu = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "New Investigation",
        href: "/",
        icon: Search,
    },
    {
        name: "Reports",
        href: "/reports",
        icon: FileText,
    },
    {
        name: "Knowledge Graph",
        href: "#",
        icon: Network,
    },
    {
        name: "RTI Intelligence",
        href: "#",
        icon: ShieldCheck,
    },
    {
        name: "Settings",
        href: "#",
        icon: Settings,
    },
];

export default function Sidebar() {
    return (
        <aside className="w-64 border-r bg-white h-screen p-5">
            <h1 className="text-2xl font-bold mb-10">
                CivicVerify AI
            </h1>

            <nav className="space-y-2">
                {menu.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100"
                        >
                            <Icon size={18} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}