import { PropsWithChildren } from "react";

export default function Section({ children }: PropsWithChildren) {
  return (
    <section className="max-w-3xl w-full mx-auto px-4 py-8">{children}</section>
  );
}
