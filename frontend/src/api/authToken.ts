import { auth } from "./firebase";

export async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  return await user.getIdToken();
}