import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { User } from "../../server/api/interface/user";
import { getUserById } from "../services/auth.services";

export const AuthContext = createContext<{
  user: User;
  fetchUser: () => Promise<void>;
  loading: boolean;
} | null>(null);

export const AuthProvider = ({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getUserById(id);
      setUser(data.data);
    } catch (error) {
      console.error("Error fetching user", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [fetchUser, id]);

  return (
    <AuthContext.Provider value={{ user: user as User, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
