import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import route from "../../assets/images/route.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useContext } from "react";
import {
  LuHouse,
  LuUser,
  LuMessageCircle,
  LuMenu,
  LuSettings,
} from "react-icons/lu";
import { authContext } from "../../Context/AuthiContext";

export default function MyNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { clearUserToken, userData } = useContext(authContext);

  function handleLogout() {
    localStorage.removeItem("tkn");
    clearUserToken();
    navigate("/auth");
  }

  function handleProfile() {
    navigate("/profile");
  }

  function handleSettings() {
    navigate("/change-password");
  }

  const navLinkClass = (path) =>
    `relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${
      location.pathname === path
        ? "bg-white text-[#1f6fe5]"
        : "text-slate-600 hover:bg-white/90 hover:text-slate-900"
    }`;

  return (
    <Navbar
      maxWidth="full"
      className="border-b border-slate-200 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-2 py-1.5 sm:gap-3 sm:px-3">
        <NavbarBrand className="m-0 grow-0">
          <div className="flex items-center gap-3">
            <img
              src={route}
              alt="Route Posts"
              className="h-9 w-9 rounded-xl object-cover"
            />
            <p className="hidden text-xl font-extrabold text-slate-900 sm:block">
              Route Posts
            </p>
          </div>
        </NavbarBrand>

        <NavbarContent
          justify="center"
          className="flex min-w-0 flex-8 justify-center "
        >
          <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/90 px-1 py-1 sm:px-1.5">
            <NavbarItem className="m-0">
              <Link to="/home" className={navLinkClass("/home")}>
                <span className="relative">
                  <LuHouse size={20} />
                </span>
                <span className="hidden sm:inline">Feed</span>
                <span className="sr-only sm:hidden">Feed</span>
              </Link>
            </NavbarItem>

            <NavbarItem className="m-0">
              <Link to="/profile" className={navLinkClass("/profile")}>
                <span className="relative">
                  <LuUser size={20} />
                </span>
                <span className="hidden sm:inline">Profile</span>
                <span className="sr-only sm:hidden">Profile</span>
              </Link>
            </NavbarItem>

            <NavbarItem className="m-0">
              <Link
                to="/notification"
                className={navLinkClass("/notification")}
              >
                <span className="relative">
                  <LuMessageCircle size={20} />
                </span>
                <span className="hidden sm:inline">Notifications</span>
                <span className="sr-only sm:hidden">Notifications</span>
              </Link>
            </NavbarItem>
          </nav>
        </NavbarContent>

        <NavbarContent as="div" justify="end" className="m-0 grow-0">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:bg-slate-100">
                <Avatar
                  as="div"
                  className="h-8 w-8 transition-transform"
                  name={userData?.name}
                  size="sm"
                  src={
                    userData?.photo ||
                    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                  }
                />
                <span className="hidden  truncate text-sm font-semibold text-slate-800 md:block">
                  {userData?.name}
                </span>
                <LuMenu size={15} className="text-slate-500" />
              </button>
            </DropdownTrigger>

            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" onClick={handleProfile}>
                <div className="flex items-center gap-2">
                  <LuUser size={18} />
                  <p className="text-[14px] font-semibold">Profile</p>
                </div>
              </DropdownItem>

              <DropdownItem key="settings" onClick={handleSettings}>
                <div className="flex items-center gap-2">
                  <LuSettings size={18} />
                  <p className="text-[14px] font-semibold">Settings</p>
                </div>
              </DropdownItem>

              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </div>
    </Navbar>
  );
}
