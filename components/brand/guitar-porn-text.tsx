type Props = {
  /** Applied to the wrapping span */
  className?: string;
};

/**
 * Brand lockup: "Guitar" in white, "Porn" in bold (no red accent).
 */
export function GuitarPornText({ className }: Props) {
  return (
    <span className={className}>
      <span className="text-white">Guitar</span>
      <span className="font-bold text-white">Porn</span>
    </span>
  );
}
