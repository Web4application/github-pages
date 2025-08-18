import { ref } from "vue";
import { auth } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

const user = ref(null);

onAuthStateChanged(auth, (u) => {
  user.value = u;
});

export function useAuth() {
  const login = (email, password) => 
    signInWithEmailAndPassword(auth, email, password);

  const register = (email, password) => 
    createUserWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  return { user, login, register, logout };
}
