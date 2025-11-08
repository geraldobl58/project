import {
  LayoutDashboard,
  Users,
  Shield,
  LogOut,
  ChevronRight,
  Cog,
  HelpCircle,
  CreditCard,
  Bell,
  User,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@/components/ui/popover";

const platformMenuItems = [
  {
    title: "Playground",
    url: "/playground",
    icon: LayoutDashboard,
    submenu: [
      { title: "History", url: "/playground/history" },
      { title: "Starred", url: "/playground/starred" },
      { title: "Settings", url: "/playground/settings" },
    ],
  },
  {
    title: "Models",
    url: "/models",
    icon: Users,
  },
  {
    title: "Documentation",
    url: "/documentation",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Cog,
  },
];

const managementMenuItems = [
  {
    title: "Usuários",
    url: "/users",
    icon: Users,
  },
  {
    title: "Funções",
    url: "/roles",
    icon: Shield,
  },
];

export function AppSidebar() {
  const location = useLocation();

  const isMenuItemActive = (url: string) => {
    return location.pathname === url;
  };

  const isMenuGroupActive = (urls: string[]) => {
    return urls.some((url) => location.pathname.startsWith(url));
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            AI
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">
              Acme Inc
            </span>
            <span className="text-xs text-muted-foreground">Enterprise</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Platform Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {platformMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <>
                      <SidebarMenuButton
                        isActive={isMenuGroupActive([item.url])}
                        className="cursor-default"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </SidebarMenuButton>
                      <SidebarMenuSub>
                        {item.submenu.map((subitem) => (
                          <SidebarMenuSubItem key={subitem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isMenuItemActive(subitem.url)}
                            >
                              <Link to={subitem.url}>
                                <span>{subitem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={isMenuItemActive(item.url)}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isMenuItemActive(item.url)}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-sidebar-accent">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-purple-400 to-pink-400">
                    <span className="text-xs font-bold text-white">SH</span>
                  </div>
                  <div className="flex flex-col flex-1 text-left">
                    <span className="text-sm font-semibold leading-tight">
                      shadcn
                    </span>
                    <span className="text-xs text-muted-foreground">
                      m@example.com
                    </span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="start" side="top">
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-purple-400 to-pink-400">
                      <span className="text-sm font-bold text-white">SH</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">shadcn</span>
                      <span className="text-xs text-muted-foreground">
                        m@example.com
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-2">
                    {/* Upgrade to Pro */}
                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent">
                      <Zap className="h-4 w-4" />
                      <span>Upgrade to Pro</span>
                    </button>

                    {/* Account */}
                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent">
                      <User className="h-4 w-4" />
                      <span>Account</span>
                    </button>

                    {/* Billing */}
                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent">
                      <CreditCard className="h-4 w-4" />
                      <span>Billing</span>
                    </button>

                    {/* Notifications */}
                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent">
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      window.location.href = "/login";
                    }}
                    className="flex w-full items-center gap-3 rounded-md border-t border-border px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
