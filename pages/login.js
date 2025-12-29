export async function getServerSideProps({ req }) {
  const cookie = req.headers.cookie || "";
  const hasInvite = cookie.includes("invite_ok=true");

  if (
    process.env.INVITE_MODE !== "OFF" &&
    (process.env.INVITE_REQUIRED || "true") === "true" &&
    !hasInvite
  ) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: {} };
}
