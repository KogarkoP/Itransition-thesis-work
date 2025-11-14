import styles from "./LoginRegisterPageTemp.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

type LoginRegisterPageTempl = {
  children: React.ReactNode;
};

const LoginRegisterPageTempl = ({ children }: LoginRegisterPageTempl) => {
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
      {children}
    </div>
  );
};

export default LoginRegisterPageTempl;
