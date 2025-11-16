import { useApp } from "@/context/AppContext";
import { User } from "@/types/user";
import { Alert, CircularProgress } from "@mui/material";
import { PropsWithChildren } from "react";
import styles from "./ProtectedRoute.module.css";

type ProtectedRouteProps = PropsWithChildren & {
  allowedRoles: User["role"][];
};

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { currentUser } = useApp();

  if (currentUser === undefined) {
    return (
      <div className={`${styles.page_wrapper} ${styles.circular_wrapper}`}>
        <CircularProgress size={80} />
      </div>
    );
  }

  if (
    currentUser === null ||
    (allowedRoles && !allowedRoles.includes(currentUser.role))
  ) {
    return (
      <div className={styles.page_wrapper}>
        <Alert severity="error">{`You have to have ${allowedRoles.join(
          ", "
        )} rights to view this content`}</Alert>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
