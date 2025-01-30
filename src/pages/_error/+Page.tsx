import { usePageContext } from "vike-react/usePageContext";
import React from "react";
import logo from "../../assets/logo.png";

export default function Page() {
  const { is404 } = usePageContext();

  return (
    <main className="grid place-items-center w-full text-center font-inter-bold">
      {is404 ? (
        <article>
        <img src={logo} alt="logo" className="w-12 h-auto block mx-auto py-4" />
          <h1>404 Page Not Found</h1>
          <p>This page could not be found.</p>
        </article>
      ) : (
        <article>
          <h1>500 Internal Server Error</h1>
          <p>Something went wrong. Please contact to support.</p>
        </article>
      )}
    </main>
  );
}
