import { redirect } from "vike/abort";

const Page = () => {
  throw redirect("/settings/security");
};

export default Page;
