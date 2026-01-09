"use client"
import Link from "next/link"

const Footer = () => {
    return (
        <footer className="mt-20 border-t border-white/10 bg-base-300/40 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 sm:py-10 py-8">

                {/* Top section */}
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-0 sm:items-center sm:justify-between">

                    <div className="flex flex-col gap-2 text-center sm:text-left">
                        {/* Brand name */}
                        <span className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                            HabitFlow
                        </span>

                        {/* Tagline */}
                        <p className="text-sm text-base-content/60 max-w-xs">
                            Build discipline through consistency, not motivation.
                        </p>
                    </div>



                    {/* Links */}
                    <div className="flex flex-col gap-5 sm:gap-4 justify-center sm:justify-start">
                        <div className="text-xs sm:text-start text-center uppercase tracking-wide text-base-content/50">
                            App
                        </div>

                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-3 text-sm">
                            <Link href="/dashboard" className="hover:text-indigo-400 transition">
                                Dashboard
                            </Link>
                            <span className="text-base-content/30">•</span>
                            <Link href="/login" className="hover:text-indigo-400 transition">
                                Login
                            </Link>
                            <span className="text-base-content/30">•</span>
                            <Link href="/register" className="hover:text-indigo-400 transition">
                                Register
                            </Link>
                        </div>


                        <div className="text-xs sm:text-start text-center uppercase tracking-wide text-base-content/50 mt-4">
                            Connect
                        </div>

                        <div className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-3 text-sm">
                            <a
                                href="https://github.com/Saurabh-Jagtap"
                                target="_blank"
                                className="hover:text-indigo-400 transition"
                            >
                                GitHub
                            </a>
                            <a
                                href="https://www.linkedin.com/in/saurabh-jagtap-084893287/"
                                target="_blank"
                                className="hover:text-indigo-400 transition"
                            >
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom line */}
                <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-base-content/50">
                    © {new Date().getFullYear()} HabitFlow. Built with focus & consistency.
                </div>

            </div>
        </footer >
    );
};

export default Footer;


