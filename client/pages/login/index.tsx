import styles from "./login.module.css";
import LoginForm from "@/components/LoginForm/LoginForm";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

const Login = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("@user_jwt");

    if (token) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return null;

  return (
    <div className={styles.main}>
      <div className={styles.back_btn_wrapper}>
        <Link href="/" passHref>
          <Button className={styles.back_btn}>
            <Icon.ArrowLeft />
            Back to main Page
          </Button>
        </Link>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
