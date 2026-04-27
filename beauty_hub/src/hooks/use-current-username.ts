"use client"

import { useSyncExternalStore } from "react"

type StoredUser = {
  username?: string
}

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

function getUsernameSnapshot() {
  try {
    const storedUser = localStorage.getItem("user")

    if (!storedUser) {
      return ""
    }

    const parsedUser = JSON.parse(storedUser) as StoredUser
    return parsedUser.username ?? ""
  } catch {
    return ""
  }
}

function getServerSnapshot() {
  return ""
}

export function useCurrentUsername() {
  return useSyncExternalStore(
    subscribeToUserStore,
    getUsernameSnapshot,
    getServerSnapshot
  )
}
