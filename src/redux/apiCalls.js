import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { publicRequest, userRequest } from "../requestMethods";

export const login = async (dispatch, user, history) => {
  // Accept history as a parameter
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

    console.log(response.data); // You can use this data for feedback or redirect the user
  } catch (error) {
    console.error(error); // Handle errors, e.g., display an error message to the user
  }
  window.location.replace("/login");
};

export const addToCart = async (productId, quantity, productSpecs) => {
  try {
    const response = await userRequest.post("/carts/add", {
      productId,
      productSpecs,
      quantity,
    });

    if (response.status === 200 || response.status === 201) {
      console.log("Product added to cart successfully");
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
      console.log("Product deleted from cart successfully");
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
      console.log("Cart fetched successfully");
      return response.data;
    }
  } catch (error) {
    console.error("Error getting cart", error);
  }
};
