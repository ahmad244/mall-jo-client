import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { publicRequest, userRequest } from "../requestMethods";
import { setQuantity } from "./cartRedux";

export const login = async (dispatch, user, navigate) => {
  // Accept history as a parameter
  dispatch(loginStart());
  try {
    const response = await publicRequest.post("/auth/login", user);
    // check response status
    if (response.status === 200 || response.status === 201) {
      dispatch(loginSuccess(response.data));
      // Redirect to "/"
      navigate("/");
    } else {
      dispatch(loginFailure());
    }
  } catch (err) {
    console.log("loggin failed", err);
    dispatch(loginFailure());
  }
};

export const register = async (username, email, password, confirmPassword) => {
  // Check if passwords match before sending the request
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await publicRequest.post("/auth/register", {
      username,
      email,
      password,
    });

  } catch (error) {
    console.error(error); 
  }
  window.location.replace("/login");
};

export const numOfProductsInCart = async (dispatch) => {
  try {
    const response = await userRequest.get("/carts/numOfProducts");
    if (response.status === 200 || response.status === 201) {
      dispatch(setQuantity(response.data.itemCount));
    }
  } catch (error) {
    console.error("Error getting number of products in cart", error);
  }
};

export const addToCart = async (productId, quantity, productSpecs) => {
  try {
    const response = await userRequest.post("/carts/add", {
      productId,
      productSpecs,
      quantity,
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error adding product to cart", error);
  }
};

export const deleteFromCart = async (cartItem) => {
  try {
    const response = await userRequest.delete(`/carts/cartItem`, {
      data: cartItem,
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error updating cart", error);
  }
};

export const getCart = async () => {
  try {
    const response = await userRequest.get(`/carts/`);
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting cart", error);
  }
};
