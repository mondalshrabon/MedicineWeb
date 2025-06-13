import { getAuth, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiUser, FiLogOut, FiSearch } from "react-icons/fi";
import { RiMedicineBottleLine } from "react-icons/ri";

const Header = ({ Theme, setTheme }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => navigate("/login"))
      .catch((err) => console.error(err));
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        Theme
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      } ${
        scrolled
          ? "shadow-lg border-b border-opacity-10 border-gray-500"
          : "border-b border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo with text and icon - No Image */}
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <RiMedicineBottleLine className="text-3xl text-blue-500 group-hover:text-blue-600 transition-colors" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">
                MediSearch
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Find your medicine instantly
              </span>
            </div>
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center space-x-6">
            {/* Search Button */}
            <button
              onClick={() => navigate("/search")}
              className={`p-2 rounded-full ${
                Theme
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
              } transition-colors`}
              aria-label="Search"
            >
              <FiSearch className="text-xl" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(!Theme)}
              className={`p-2 rounded-full ${
                Theme
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
              } transition-colors`}
              aria-label="Toggle theme"
            >
              {Theme ? (
                <FiSun className="text-xl" />
              ) : (
                <FiMoon className="text-xl" />
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  Theme
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                } transition-colors`}
                aria-label="User menu"
              >
                <FiUser className="text-xl" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                    Theme
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <button
                    onClick={handleLogout}
                    className={`flex items-center px-4 py-2 w-full text-left ${
                      Theme
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    } transition-colors`}
                  >
                    <FiLogOut className="mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;