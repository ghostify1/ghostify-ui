export function inviteRequired() {
  return (
    process.env.INVITE_MODE !== "OFF" &&
    (process.env.INVITE_REQUIRED || "true") === "true"
  );
}

export function hasInviteCookie(req) {
  const cookie = req.headers.cookie || "";
  return cookie.includes("invite_ok=true");
}
