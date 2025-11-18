import { use, useState } from "react";
import styles from "./SalesforceForm.module.css";
import { syncUserToSalesforce } from "@/pages/api/salesforce";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import { updateUserById } from "@/pages/api/userFetch";

type SalesforceSyncFormProps = {
  toggleSalesforceForm: () => void;
};

export default function SalesforceSyncForm({
  toggleSalesforceForm,
}: SalesforceSyncFormProps) {
  const { t } = useTranslation();
  const { currentUser } = useApp();
  const [firstName, setFirstName] = useState(currentUser?.name || "");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async () => {
    setMessage("");

    try {
      const newErrors: { [key: string]: string } = {};
      if (!firstName) newErrors.firstName = t("required");
      if (!lastName) newErrors.lastName = t("required");
      if (!email) {
        newErrors.email = t("required");
      } else if (!email.includes("@")) {
        newErrors.email = t("inavlidEmail");
      }
      if (!phone) newErrors.phone = t("required");

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
      };
      console.log("Calling syncUserToSalesforce...");
      const result = await syncUserToSalesforce(userData);
      console.log(result);
      if (result.data.success === true) {
        setMessage("Successfully synced to Salesforce!");
        if (!currentUser) {
          console.error("No current user!");
          return;
        }
        updateUserById({
          userId: currentUser.id,
          userOption: "saleforceSync",
          userValue: true,
        });
        toggleSalesforceForm();
      }
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setMessage("Sync failed: " + err.message);
      } else {
        setMessage("Sync failed: Unknown error");
      }
    }
  };

  return (
    <ModalTemplate>
      <div className={styles.main}>
        <div className={styles.form_wrapper}>
          <div className={styles.close_btn}>
            <Icon.X onClick={() => toggleSalesforceForm()} />
          </div>
          <h2>Sync Your Profile to Salesforce</h2>
          <div className={styles.form_row}>
            <label htmlFor="name">
              {t("name")}
              <span className={styles.required} title={t("required")}>
                *
              </span>
            </label>
            <input
              id="name"
              type="text"
              placeholder={t("name")}
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setErrors((prev) => {
                  const { firstName, ...res } = prev;
                  return res;
                });
              }}
            />
            {errors.firstName && (
              <p className={styles.field_error}>{errors.firstName}</p>
            )}
          </div>
          <div className={styles.form_row}>
            <label htmlFor="name">
              {t("lastName")}
              <span className={styles.required} title={t("required")}>
                *
              </span>
            </label>
            <input
              id="lastName"
              type="text"
              placeholder={t("lastName")}
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setErrors((prev) => {
                  const { lastName, ...res } = prev;
                  return res;
                });
              }}
            />
          </div>
          {errors.lastName && (
            <p className={styles.field_error}>{errors.lastName}</p>
          )}
          <div className={styles.form_row}>
            <label htmlFor="email">
              {t("email")}
              <span className={styles.required} title={t("required")}>
                *
              </span>
            </label>
            <input
              id="email"
              type="text"
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
          </div>
          {errors.email && <p className={styles.field_error}>{errors.email}</p>}
          <div className={styles.form_row}>
            <label htmlFor="phone">
              {t("phone")}
              <span className={styles.required} title={t("required")}>
                *
              </span>
            </label>
            <input
              id="phone"
              type="text"
              placeholder={t("phone")}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors((prev) => {
                  const { phone, ...res } = prev;
                  return res;
                });
              }}
            />
          </div>
          {errors.street && (
            <p className={styles.field_error}>{errors.street}</p>
          )}
        </div>
        <Button onClick={handleSubmit}>Sync to Salesforce</Button>
        {message && <p>{message}</p>}
      </div>
    </ModalTemplate>
  );
}
