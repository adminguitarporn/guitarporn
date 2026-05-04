type Props = {
  /** Applied to the wrapping span */
  className?: string;
};

/**
 * Brand lockup: "Guitar" in white, "Porn" in crimson.
 */
export function GuitarPornText({ className }: Props) {
  return (
    <span className={className}>
      <span className="text-white">Guitar</span>
      <span className="text-crimson">Porn</span>
    </span>
  );
}
