import Image from "next/image";

export default function Logo({ size = 64 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Image
          src="/logo-ghostify.png" // /public içine koyduğumuz hayalet+mini simgeler
          width={size}
          height={size}
          alt="Ghostify"
          priority
          className="drop-shadow-glow"
        />
      </div>
      <span className="text-2xl font-extrabold tracking-wide text-primary drop-shadow-glow hidden sm:block">
        GHOSTIFY
      </span>
    </div>
  );
}
