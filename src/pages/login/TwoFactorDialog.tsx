import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import Dialog from "../../components/Dialog";
import Input from "../../components/Input";
import { Form, Formik } from "formik";
import Button from "../../components/Button";
import { verify2fa } from "../../services/auth.services";
import { navigate } from "vike/client/router";
import { useAlert } from "../../../hooks/useAlert";

const TwoFactorDialog = ({ show, hide, user }: any) => {
  const { addAlert } = useAlert();
  const handleSubmit = async (values) => {
    try {
      await verify2fa({
        id: user.id,
        token_2fa: values.token_2fa.toString(),
      });
      await navigate("/dashboard");
      addAlert({
        message: "Login successful",
        severity: "success",
        timeout: 4,
      });
    } catch (error: any) {
      console.log(error);
      addAlert({
        message: error.response.data.message,
        severity: "error",
        timeout: 5,
      });
    }
  };
  return (
    <Dialog
      show={show}
      hide={hide}
      className="p-6 flex flex-col items-center text-neutral-300 !max-w-[500px] text-center"
    >
      <Formik
        initialValues={{
          token_2fa: "",
        }}
        onSubmit={handleSubmit}
      >
        {() => (
          <>
            <span className="text-2xl mb-5">Two-factor authentication</span>
            <DevicePhoneMobileIcon width={35} className="text-[#8d96a0]" />
            <span className="text-xl py-3">Authentication code</span>
            <Form>
              <Input
                name="token_2fa"
                id="token_2fa"
                type="number"
                placeholder="XXXXXX"
              />
              <Button
                className="bg-[#238636] hover:bg-[#2ba443] rounded-md w-full py-[5px] my-4 text-sm"
                submit
              >
                Verify
              </Button>
            </Form>
            <span className="text-center text-sm text-[#b5c0cd]">
              Open your two-factor authenticator (TOTP) app or browser extension
              to view your authentication code.
            </span>
          </>
        )}
      </Formik>
    </Dialog>
  );
};

export default TwoFactorDialog;
