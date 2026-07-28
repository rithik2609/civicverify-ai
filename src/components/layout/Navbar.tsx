export default function Navbar() {
    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
            <input
                placeholder="Search investigations..."
                className="border rounded-lg px-4 py-2 w-80"
            />

            <div className="flex items-center gap-4">
                <button className="border rounded-lg px-4 py-2">
                    Notifications
                </button>

                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                    R
                </div>
            </div>
        </header>
    );
}