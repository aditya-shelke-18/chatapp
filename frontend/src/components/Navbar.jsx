import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User, Zap } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 z-40 w-full border-b border-base-300/30 bg-base-100/70 backdrop-blur-xl">
      <div className="container h-16 px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            <Zap className="size-4 text-primary-content" fill="currentColor" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Talkify
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link to="/settings" className="btn btn-ghost btn-sm gap-1.5 text-base-content/60 hover:text-base-content">
            <Settings className="size-4" />
            <span className="hidden sm:inline text-xs">Settings</span>
          </Link>

          {authUser && (
            <>
              <Link to="/profile" className="btn btn-ghost btn-sm gap-1.5 text-base-content/60 hover:text-base-content">
                <User className="size-4" />
                <span className="hidden sm:inline text-xs">Profile</span>
              </Link>
              <button
                onClick={logout}
                className="btn btn-ghost btn-sm gap-1.5 text-base-content/60 hover:text-error"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline text-xs">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
