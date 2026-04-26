"use client"

import { useRouter } from "next/navigation"

export function useLogout() {
  const router = useRouter()

  return () => {
    localStorage.removeItem("user")
    window.dispatchEvent(new Event("beauty-hub:user"))
    router.push("/")
  }
}
