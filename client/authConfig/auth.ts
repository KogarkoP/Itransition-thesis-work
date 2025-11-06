import { AuthProvider, signInWithPopup, User } from "firebase/auth";
import { auth } from "./firebase-config";
import { FirebaseError } from "firebase/app";

interface SocialAuthResult {
  user: User | null;
  error?: string;
}

const socialMediaAuth = async (
  provider: AuthProvider
): Promise<SocialAuthResult> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return { user: result.user };
  } catch (err) {
    const error = err as FirebaseError;
    if (error.code === "auth/account-exists-with-different-credential") {
      const email = error.customData?.email;
      return {
        user: null,
        error: `This email ${email} is already registered with another provider`,
      };
    }
    console.error("Social login error:", error.message);
    return { user: null, error: error.message };
  }
};

export default socialMediaAuth;
