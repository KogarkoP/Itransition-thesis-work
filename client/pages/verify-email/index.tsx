import styles from "./verify-email.module.css";
import PageTemplate from "@/components/PageTemplate/PageTemplate";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert, CircularProgress } from "@mui/material";
import { postRequest } from "../api/userFetch";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

type User = {
  [key: string]: string;
};

const VerifyEmail = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const emailToken = searchParams.get("emailToken");

  useEffect(() => {
    if (!emailToken) {
      setError(t("emailVerificationFailed"));
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        const response = await postRequest({ emailToken });
        setUser(response);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        const message =
          axiosError.response?.data.message || t("unexpected error");
        setError(message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [emailToken]);

  useEffect(() => {
    if (!user.isVerified) return;

    const timeoutId = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [user.isVerified]);

  return (
    <PageTemplate>
      <div className={styles.page_wrapper}>
        {isLoading ? (
          <div>
            <CircularProgress />
          </div>
        ) : (
          <div>
            {user?.isVerified ? (
              <div>
                <Alert severity="success">{t("emailVerification")}</Alert>
              </div>
            ) : (
              <div>{error && <Alert severity="error">{error}</Alert>}</div>
            )}
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default VerifyEmail;
