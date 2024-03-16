import { useDispatch } from "react-redux";
import { RESET_STATE } from "../redux/actions";
import { useEffect } from "react";

const Logout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: RESET_STATE });
  });
  return <></>;
};

export default Logout;
