import { Ship, Radio, Settings, LifeBuoy } from 'lucide-react';

export default function Layout({ children, connected }) {
    return (
        <div className="flex h-screen w-full bg-background overflow-hidden text-text-primary">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-20 items-center py-6 border-r border-gray-800 bg-card/50">
                <div className="mb-8 p-3 rounded-xl bg-primary/20 text-primary">
                    <Ship size={24} />
                </div>

                <nav className="flex-1 flex flex-col gap-6 w-full items-center">
                    <NavItem icon={<Radio size={20} />} active />
                    <NavItem icon={<Settings size={20} />} />
                    <NavItem icon={<LifeBuoy size={20} />} />
                </nav>

                <div className={`w-3 h-3 rounded-full ${connected ? 'bg-success animate-pulse' : 'bg-danger'}`} title={connected ? "Connected" : "Disconnected"} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}

function NavItem({ icon, active }) {
    return (
        <button className={`p-3 rounded-xl transition-all ${active ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
            {icon}
        </button>
    )
}
