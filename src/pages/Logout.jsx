import { useDispatch } from "react-redux";
import { logoutRun } from "../redux/userRedux";

const Logout = () => {
  const dispatch = useDispatch();
  dispatch(logoutRun());
  return <></>;
};

export default Logout;
