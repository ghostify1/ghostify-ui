// pages/login.js
import dynamic from "next/dynamic";

const LoginClient = dynamic(() => import("../sections/LoginClient"), {
  ssr: false,
});

export default function LoginPage() {
  return <LoginClient />;
}
