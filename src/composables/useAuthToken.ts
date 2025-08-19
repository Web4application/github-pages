import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";
import { auth } from "../firebase";

const idToken = ref<string | null>(null);

onAuthStateChanged(auth, async (u) => {
  idToken.value = u ? await u.getIdToken() : null;
});

export function useAuthToken() {
  return { idToken };
}
