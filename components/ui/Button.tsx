import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
};

export default function Button({ className, variant="solid", ...props }: Props) {
  return (
    <button
      {...props}
      className={clsx(
        variant === "solid" ? "btn" : "btn-ghost",
        className
      )}
    />
  );
}
