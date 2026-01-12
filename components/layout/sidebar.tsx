"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  collapsed?: boolean
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  var pathname = usePathname()

  var menuItems = [
    { icon: "🏠", label: "Dashboard", href: "/dashboard" },
    { icon: "🔍", label: "New Audit", href: "/" },
    { icon: "📊", label: "Reports", href: "/reports" },
    { icon: "⚙️", label: "Settings", href: "/settings" },
  ]

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname.startsWith("/business/")
    }
    return pathname === href
  }

  return (
    <aside className={
      "fixed left-0 top-0 h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 text-white flex flex-col transition-all duration-300 z-50 " +
      (collapsed ? "w-16" : "w-56")
    }>
      {/* Logo */}
      <div className="p-4 border-b border-indigo-500">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-lg">S</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-xl">SeenBy</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map(function(item) {
          var active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all " +
                (active 
                  ? "bg-white text-indigo-600 shadow-lg" 
                  : "text-indigo-100 hover:bg-indigo-500")
              }
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade Banner */}
      {!collapsed && (
        <div className="p-4">
          <div className="bg-indigo-500 rounded-xl p-4">
            <div className="text-sm font-medium text-indigo-100 mb-1">Free Plan</div>
            <div className="text-xs text-indigo-200 mb-3">1 of 1 business tracked</div>
            <Link 
              href="/upgrade"
              className="block w-full bg-white text-indigo-600 text-center py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      )}

      {/* User */}
      <div className="p-4 border-t border-indigo-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-400 rounded-full flex items-center justify-center font-semibold">
            K
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">Kurt</div>
              <div className="text-xs text-indigo-200 truncate">kurt@example.com</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}