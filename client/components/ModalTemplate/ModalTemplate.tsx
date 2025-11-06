import styles from "./ModalTemplate.module.css";

type ModalTemplateProps = {
  children: React.ReactNode;
};

const ModalTemplate = ({ children }: ModalTemplateProps) => {
  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>{children}</div>
    </div>
  );
};

export default ModalTemplate;
