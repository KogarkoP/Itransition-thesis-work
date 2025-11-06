import { useState } from "react";
import { useRouter } from "next/router";
import { insertUser } from "@/pages/api/userFetch";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import * as Icon from "react-bootstrap-icons";
import styles from "./RegistrationForm.module.css";
import Link from "next/link";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

const RegistrationForm = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [termsPrivacy, setTermsPrivacy] = useState(false);
  const [password, setPassword] = useState("");
  const [isRegistered, setRegistered] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const onSubmit = async () => {
    try {
      const newErrors: { [key: string]: string } = {};

      if (!name.trim()) newErrors.name = t("nameField");
      if (!email.trim()) {
        newErrors.email = t("emailField");
      } else if (!email.includes("@")) {
        newErrors.email = t("inavlidEmail");
      }
      if (!password) {
        newErrors.password = t("passwordField");
      } else if (!/^\S+$/.test(password)) {
        newErrors.password = t("notCorrectPassword");
      }
      if (!termsPrivacy) newErrors.termsPrivacy = t("privacyPolicyAgree");

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const user = {
        name: name,
        email: email,
        terms_privacy: termsPrivacy,
        password: password,
      };

      const response = await insertUser(user);
      if (response.status === 201) {
        setRegistered(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch (err: unknown) {
      let status: number | undefined;
      if (err instanceof AxiosError) {
        status = err.response?.status;
      }
      setErrorMessage(status === 409 ? t("userExists") : t("somethingWrong"));

      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <>
      {isError && (
        <ModalTemplate>
          <div className={`${styles.message} ${styles.error}`}>
            <Icon.XCircle />
            <p>{errorMessage}</p>
          </div>
        </ModalTemplate>
      )}
      {isRegistered && (
        <ModalTemplate>
          <div className={styles.message}>
            <Icon.CheckCircle className={styles.success} />
            <p>
              {t("successfyllyCreatedAcc")}
              <br />
              {t("pleaseVerify")}
            </p>
          </div>
        </ModalTemplate>
      )}
      <div className={styles.main}>
        <h2>{t("registration")}</h2>
        <p className={styles.indication}>{t("enterCredentials")}</p>
        <div className={styles.form_row}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder={t("name")}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => {
                const { name, ...res } = prev;
                return res;
              });
            }}
          />
          {errors.name && <p className={styles.field_error}>{errors.name}</p>}
        </div>
        <div className={styles.form_row}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => {
                const { email, ...res } = prev;
                return res;
              });
            }}
          />
          {errors.email && <p className={styles.field_error}>{errors.email}</p>}
        </div>
        <div className={styles.form_row}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => {
                const { password, ...res } = prev;
                return res;
              });
            }}
          />
          {errors.password && (
            <p className={styles.field_error}>{errors.password}</p>
          )}
        </div>
        <div className={styles.checkbox}>
          <div className={styles.checkbox_wrapper}>
            <input
              id="terms"
              type="checkbox"
              checked={termsPrivacy}
              onChange={(e) => {
                setTermsPrivacy(e.target.checked);
                setErrors((prev) => {
                  const { termsPrivacy, ...res } = prev;
                  return res;
                });
              }}
            />
            <label htmlFor="terms">
              {t("iAgree")}
              <span>
                <Link href={"/"}>Terms</Link>
              </span>
              {t("&")}
              <span>
                <Link href={"/"}>{t("privacyPolicy")}</Link>
              </span>
            </label>
          </div>
          {errors.termsPrivacy && (
            <p className={styles.field_error}>{errors.termsPrivacy}</p>
          )}
        </div>
        <button onClick={onSubmit}>{t("register")}</button>
        <div className={styles.login_con}>
          <p>
            {t("alreadyHaveAccQ")}
            <span>
              <Link href={"/login"}>{t("login")}</Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
