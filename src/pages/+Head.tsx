export { Head };

import favicon from "../assets/favicon.png";
import React from "react";

function Head() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Auth for inventary app" />
      <link rel="icon" href={favicon} />
    </>
  );
}
