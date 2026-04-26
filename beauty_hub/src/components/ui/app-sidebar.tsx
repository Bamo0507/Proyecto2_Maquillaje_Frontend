"use client"

import type { ComponentProps, ElementType } from "react"
import { useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HeartIcon,
  LogOutIcon,
  MessageSquareTextIcon,
  RouteIcon,
  SettingsIcon,
  SparklesIcon,
  StarIcon,
  UserIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/sidebar"
import { useLogout } from "@/hooks/use-logout"

type AuthUser = {
  username: string
  isPremium: boolean
  role: "admin" | "user"
}

type MenuItem = {
  title: string
  url: string
  icon: ElementType
}

type MenuSection = {
  title: string
  items: MenuItem[]
}

const GENERAL_ITEMS: MenuItem[] = [
  {
    title: "Your Glow Picks",
    url: "/generalRecommendations",
    icon: SparklesIcon,
  },
  {
    title: "Reviews",
    url: "/reviews",
    icon: MessageSquareTextIcon,
  },
  {
    title: "Rutinas",
    url: "/rutinas",
    icon: RouteIcon,
  },
  {
    title: "Favoritos",
    url: "/favoritos",
    icon: HeartIcon,
  },
  {
    title: "Perfil",
    url: "/perfil",
    icon: UserIcon,
  },
]

const PREMIUM_ITEMS: MenuItem[] = [
  {
    title: "Smart Picks",
    url: "/smartPicks",
    icon: StarIcon,
  },
]

const ADMIN_ITEMS: MenuItem[] = [
  {
    title: "Gestion",
    url: "/gestion",
    icon: SettingsIcon,
  },
]

function getUserDescription(user: AuthUser) {
  if (user.role === "admin") {
    return "Administrador"
  }

  return user.isPremium ? "Usuario premium" : "Usuario general"
}

const emptyUser: AuthUser = {
  username: "",
  isPremium: false,
  role: "user",
}

let cachedUserRaw: string | null = null
let cachedUserSnapshot: AuthUser = emptyUser

function subscribeToUserStore(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange)
  window.addEventListener("beauty-hub:user", onStoreChange)
  window.addEventListener("pageshow", onStoreChange)

  return () => {
    window.removeEventListener("storage", onStoreChange)
    window.removeEventListener("beauty-hub:user", onStoreChange)
    window.removeEventListener("pageshow", onStoreChange)
  }
}

function getUserSnapshot(): AuthUser {
  try {
    const storedUser = localStorage.getItem("user")

    if (!storedUser) {
      cachedUserRaw = null
      cachedUserSnapshot = emptyUser
      return emptyUser
    }

    if (storedUser === cachedUserRaw) {
      return cachedUserSnapshot
    }

    cachedUserRaw = storedUser
    cachedUserSnapshot = {
      ...emptyUser,
      ...JSON.parse(storedUser),
    } as AuthUser

    return cachedUserSnapshot
  } catch {
    cachedUserRaw = null
    cachedUserSnapshot = emptyUser
    return emptyUser
  }
}

function getServerSnapshot(): AuthUser {
  return emptyUser
}

function useStoredUser() {
  return useSyncExternalStore(
    subscribeToUserStore,
    getUserSnapshot,
    getServerSnapshot
  )
}

function getMenuSections(user: AuthUser): MenuSection[] {
  const sections: MenuSection[] = [
    {
      title: "General",
      items: GENERAL_ITEMS,
    },
  ]

  if (user.isPremium) {
    sections.push({
      title: "Premium",
      items: PREMIUM_ITEMS,
    })
  }

  if (user.role === "admin") {
    sections.push({
      title: "Admin",
      items: ADMIN_ITEMS,
    })
  }

  return sections
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const logout = useLogout()
  const user = useStoredUser()
  const menuSections = getMenuSections(user)
  const displayName = user.username || "Beauty Hub"
  const userDescription = getUserDescription(user)

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <SparklesIcon
            aria-hidden="true"
            className="size-5 shrink-0 text-sidebar-primary"
          />
          <span className="min-w-0 overflow-hidden whitespace-nowrap font-heading text-base font-semibold opacity-100 transition-[max-width,opacity] duration-300 ease-out group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
            Beauty Hub
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon aria-hidden="true" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={displayName}
                  className="cursor-pointer group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0!"
                >
                  <UserIcon aria-hidden="true" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {displayName}
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                className="w-56"
              >
                <DropdownMenuLabel>
                  <span className="block truncate text-sm text-foreground">
                    {displayName}
                  </span>
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                    {userDescription}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={logout}>
                  <LogOutIcon aria-hidden="true" />
                  <span>Cerrar sesion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
