import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { publicRequest } from "../requestMethods";

export const login = async (dispatch, user, history) => { // Accept history as a parameter
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));

    // Redirect to "/"
    history.push("/");
  } catch (err) {
    dispatch(loginFailure());
  }
};
