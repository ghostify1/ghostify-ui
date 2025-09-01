import clsx from "clsx";
type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

export default function Input({ label, className, ...props }: Props) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm text-[var(--muted)]">{label}</span>}
      <input {...props} className={clsx("input", className)} />
    </label>
  );
}
