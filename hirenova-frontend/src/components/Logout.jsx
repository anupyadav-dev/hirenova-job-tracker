import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Logout = () => {
  const dispatch = useDispatch();

  return <button onClick={() => dispatch(logout())}>Logout</button>;
};

export default Logout;
