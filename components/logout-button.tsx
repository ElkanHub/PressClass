"use client";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const logout = async () => {
    await fetch("/auth/logout", {
      method: "GET",
      credentials: "include",
    });

    window.location.href = "/auth/login";
  };

  return <Button onClick={logout}>Logout</Button>;
}
