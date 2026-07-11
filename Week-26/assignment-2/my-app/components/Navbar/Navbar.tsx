export default function Navbar() {
    return (
        <nav className="bg-purple-600 p-4 text-white flex justify-between">
            <h1 className="text-xl font-bold"><a href="/">Event Booking</a></h1>
            <div>
                <a href="/events" className="mr-4">Events</a>
                <a href="/signin" className="mr-4">Sign In</a>
                <a href="/signup">Sign Up</a>
            </div>
        </nav>
    )
}