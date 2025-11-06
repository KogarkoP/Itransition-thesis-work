import styles from "./LoginForm.module.css";
import Cookies from "js-cookie";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import Link from "next/link";
import { facebookProvider, googleProvider } from "@/authConfig/authMethods.js";
import socialMediaAuth from "@/authConfig/auth";
import * as Icon from "react-bootstrap-icons";
import { useState } from "react";
import { login, loginSocialMedia } from "@/pages/api/userFetch";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import {
  FacebookAuthProvider,
  getIdToken,
  GoogleAuthProvider,
} from "firebase/auth";
import { AxiosResponse } from "axios";
import { LoginResponse } from "@/types/user";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setError] = useState(false);
  const [socialLoginError, setSocialLoginError] = useState<string>("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  const handleLoginResponse = (response: AxiosResponse<LoginResponse>) => {
    if (response.data.user.isBlocked === true) {
      setIsBlocked(true);
      setTimeout(() => setIsBlocked(false), 4000);
      return;
    }

    if (response.status === 200) {
      Cookies.set("@user_jwt", response.data.jwt);
      const userId = response.data.user.id;
      const userLanguage = response.data.user.language;
      const userTheme = response.data.user.theme;
      localStorage.setItem("userId", userId);
      localStorage.setItem("userLanguage", userLanguage);
      localStorage.setItem("userTheme", userTheme);
      router.push("/");
      i18n.changeLanguage(userLanguage);
    }
  };

  const onSubmit = async () => {
    try {
      const newErrors: { [key: string]: string } = {};
      if (!email) {
        newErrors.email = t("emailField");
      } else if (!email.includes("@")) {
        newErrors.email = t("inavlidEmail");
      }
      if (!password) newErrors.password = t("passwordField");

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const loginData = {
        email: email,
        password: password,
      };

      const response = await login(loginData);

      handleLoginResponse(response);

      setEmail("");
      setPassword("");
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  const onSocialMediaLogin = async (
    provider: FacebookAuthProvider | GoogleAuthProvider
  ) => {
    try {
      const { user, error } = await socialMediaAuth(provider);

      if (
        error === "Firebase: Error (auth/cancelled-popup-request)." ||
        error === "Firebase: Error (auth/popup-closed-by-user)."
      ) {
        return;
      }

      if (error) {
        setError(true);
        setSocialLoginError(error);
        setTimeout(() => {
          setError(false);
          setSocialLoginError("");
        }, 4000);
        return;
      }

      if (!user) {
        console.error("No user returned from social login.");
        return;
      }

      const token = await getIdToken(user, true);

      const response = await loginSocialMedia(token);
      handleLoginResponse(response);
    } catch (error) {
      console.error("Social login error:", error);
    }
  };

  return (
    <>
      {(isError || isBlocked) && (
        <ModalTemplate>
          <div className={`${styles.message} ${styles.error}`}>
            <Icon.XCircle />
            <p>
              {isBlocked
                ? t("blockedAcc")
                : socialLoginError
                ? socialLoginError
                : t("emailAndPassW")}
            </p>
          </div>
        </ModalTemplate>
      )}
      <div className={styles.main}>
        <h2>{t("login")}</h2>
        <p className={styles.indication}>{t("enterEmailAndPass")}</p>
        <div className={styles.form_row}>
          <label htmlFor="email">{t("email")}</label>
          <input
            id="email"
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => {
                const { email, ...rest } = prev;
                return rest;
              });
            }}
          />
          {errors.email && <p className={styles.field_error}>{errors.email}</p>}
        </div>
        <div className={styles.form_row}>
          <label htmlFor="password">{t("password")}</label>
          <input
            id="password"
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => {
                const { password, ...rest } = prev;
                return rest;
              });
            }}
          />
          {errors.password && (
            <p className={styles.field_error}>{errors.password}</p>
          )}
        </div>
        <button onClick={onSubmit}>{t("login")}</button>
        <div className={styles.register_con}>
          <p>
            {t("dontHaveAcc")}
            <span>
              <Link href={"/register"}>{t("registerNow")}</Link>
            </span>
          </p>
        </div>
      </div>
      <div className={styles.social_media_bttn_wrapper}>
        <Button
          onClick={() => onSocialMediaLogin(facebookProvider)}
          className={styles.facebook_bttn}
        >
          <Icon.Facebook />
          {t("loginFb")}
        </Button>
        <Button
          onClick={() => onSocialMediaLogin(googleProvider)}
          className={`${styles.google_bttn} btn btn-light`}
        >
          <Icon.Google />
          {t("loginGoogle")}
        </Button>
      </div>
    </>
  );
};

export default LoginForm;
