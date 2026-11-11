import { auth } from "./firebase";

export async function getAuthToken(): Promise<string | null> {
  await auth.authStateReady();
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
}