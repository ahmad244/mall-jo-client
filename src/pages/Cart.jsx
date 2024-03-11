import { Add, Remove } from "@material-ui/icons";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { mobile } from "../responsive";
import StripeCheckout from "react-stripe-checkout";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { useNavigate  } from "react-router";
import { getCart, addToCart, deleteFromCart } from "../redux/apiCalls";

const KEY = process.env.REACT_APP_STRIPE;

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
`;

const TopTexts = styled.div`
  ${mobile({ display: "none" })}
`;
const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductId = styled.span``;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

const Cart = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [stripeToken, setStripeToken] = useState(null);
  const navigate = useNavigate ();
  const onToken = (token) => {
    setStripeToken(token);
  };
  const [cart, setCart] = useState({});
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await getCart(user._id);
        handleCartRender(cartData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCart();
  }, []);

  const handleCartRender = (cartData) => {
    let TempCartTotal = 0.0;

    cartData.products.forEach((cartItem) => {
      TempCartTotal += cartItem.product.price * cartItem.quantity;
    });
    setCartTotal(TempCartTotal.toFixed(2));

    setCart(cartData);
  };

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await userRequest.post("/checkout/payment", {
          tokenId: stripeToken.id,
          amount: 500,
        });
        navigate.push("/success", {
          stripeData: res.data,
          products: cart,
        });
      } catch {}
    };
    stripeToken && makeRequest();
  }, [stripeToken, cartTotal, navigate, cart]);

  const handleCartAddRemove = (cartItem, quantity, index) => {
    const updatedCartItem = { ...cartItem }; // Create a copy of the cart item
    updatedCartItem.quantity += quantity; // Update the quantity

    let updatedCart = { ...cart }; // Create a copy of the cart

    if (updatedCartItem.quantity > 0) {
      addToCart(updatedCartItem.productId, quantity, updatedCartItem.productSpecs);
      console.log("index---> ", index);
      updatedCart.products[index] = updatedCartItem; // Update the cart item at the specified index
    } else {
      deleteFromCart(updatedCartItem);
      updatedCart.products.splice(index, 1); // Remove the cart item from the products array
    }

    handleCartRender(updatedCart);
  };

  return (
    <Container>
      <Navbar />
      <Announcement />
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <TopButton>CONTINUE SHOPPING</TopButton>
          <TopTexts>
            <TopText>Shopping Bag(2)</TopText>
            <TopText>Your Wishlist (0)</TopText>
          </TopTexts>
          <TopButton type="filled">CHECKOUT NOW</TopButton>
        </Top>
        {cart && (
          <Bottom>
            <Info>
              {cart?.products?.map((cartItem, index) => (
                <Product
                  key={
                    cartItem.productId + JSON.stringify(cartItem.productSpecs)
                  }
                >
                  <ProductDetail>
                    <Image src={cartItem.product.img} />
                    <Details>
                      <ProductName>
                        <b>Product:</b> {cartItem.product.title}
                      </ProductName>
                      <ProductId>
                        <b>ID:</b> {cartItem.productId}
                      </ProductId>
                      <ProductColor color={cartItem.productSpecs.color} />
                      <ProductSize>
                        <b>Size:</b> {cartItem.productSpecs.size}
                      </ProductSize>
                    </Details>
                  </ProductDetail>
                  <PriceDetail>
                    <ProductAmountContainer>
                      <Add
                        onClick={() => {
                          handleCartAddRemove(cartItem, 1, index);
                        }}
                      />
                      <ProductAmount>{cartItem.quantity}</ProductAmount>
                      <Remove
                        onClick={() => {
                          handleCartAddRemove(cartItem, -1, index);
                        }}
                      />
                    </ProductAmountContainer>
                    <ProductPrice>
                      ${" "}
                      {(cartItem.product.price * cartItem.quantity).toFixed(2)}
                    </ProductPrice>
                  </PriceDetail>
                </Product>
              ))}
              <Hr />
            </Info>
            <Summary>
              <SummaryTitle>ORDER SUMMARY</SummaryTitle>
              <SummaryItem>
                <SummaryItemText>Subtotal</SummaryItemText>
                <SummaryItemPrice>$ {cartTotal}</SummaryItemPrice>
              </SummaryItem>
              <SummaryItem>
                <SummaryItemText>Estimated Shipping</SummaryItemText>
                <SummaryItemPrice>$ 5.90</SummaryItemPrice>
              </SummaryItem>
              <SummaryItem>
                <SummaryItemText>Shipping Discount</SummaryItemText>
                <SummaryItemPrice>$ -5.90</SummaryItemPrice>
              </SummaryItem>
              <SummaryItem type="total">
                <SummaryItemText>Total</SummaryItemText>
                <SummaryItemPrice>$ {cartTotal}</SummaryItemPrice>
              </SummaryItem>
              <StripeCheckout
                name="Lama Shop"
                image="https://avatars.githubusercontent.com/u/1486366?v=4"
                billingAddress
                shippingAddress
                description={`Your total is $${cartTotal}`}
                amount={cartTotal * 100}
                token={onToken}
                stripeKey={KEY}
              >
                <Button>CHECKOUT NOW</Button>
              </StripeCheckout>
            </Summary>
          </Bottom>
        )}
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Cart;
