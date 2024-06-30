import { usePageContext } from "../../../hooks/usePageContext";

export { Page };

function Page() {
  const pageContext = usePageContext();
  let { abortReason } = pageContext;
  if (!abortReason) {
    abortReason = pageContext.is404
      ? "Page not found."
      : "Something went wrong.";
  }
  return (
    <div className="w-full min-h-screen grid place-items-center bg-neutral-900 text-neutral-400 text-4xl font-inter-bold">
      <p style={{ fontSize: "1.3em" }}>{abortReason}</p>
    </div>
  );
}
