import React, {useEffect} from 'react'
import {Link, useParams,useNavigate, useLocation} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroupItem, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import {addToCart, removeFromCart} from '../actions/cartActions'


function CartScreen() {

  const params = useParams()
  const productId = params.id;

  let navigate = useNavigate()
  let location = useLocation()
  const qty = location.search ? Number(location.search.split('=')[1]) : 1 

  const dispatch = useDispatch()

  const cart = useSelector(state => state.cart)
  const {cartItems} = cart
 
  useEffect(() => {
    if(productId){ 
      dispatch(addToCart(productId, qty))
    }

  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id) =>{
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () =>{
    navigate('/login?redirect=shipping')
  }
  

  return (
    <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message variant='info'>
              Your cart is empty <Link to='/'>Go Back</Link>
            </Message>
          ): (
            <ListGroup variant='flush'>
                {cartItems.map(item =>(
                  <ListGroupItem key={item.product}>
                      <Row>
                        <Col md={2}>
                          <Image src={item.image} alt={item.name} fluid rounded/>
                        </Col>
                        <Col md={3}>
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </Col>
                        <Col md={2}>
                          ${item.price}
                        </Col>
                        <Col md={3}>
                          <Form.Control as="select" value={item.qty} onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))} >
                                            {
                                                [...Array(item.countInStock).keys()].map((x) =>(
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))
                                            }

                          </Form.Control>
                        </Col>
                        <Col md={1}>
                          <Button type='button' variant='dark' onClick={()=> removeFromCartHandler(item.product)}>
                              <i className='fas fa-trash'></i>
                          </Button>
                       </Col>

                      </Row>
                  </ListGroupItem>
                ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
                    <ListGroupItem>
                      <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty , 0)}) items</h2>
                      ${cartItems.reduce((acc, item) => acc + item.qty * item.price , 0).toFixed(2)}
                    </ListGroupItem>
            </ListGroup>

            <ListGroup variant='flush'>
            <ListGroupItem>
              <Button type='button' className=' btn btn-block' disabled={cartItems.length === 0} onClick={() => checkoutHandler()} style={{textAlign: "center", width: "300px", marginLeft: "3rem"}}>
                  Proceed to checkout
              </Button>
            </ListGroupItem>
            </ListGroup>

          </Card>
        </Col>
    </Row>
  )
}

export default CartScreen

// import React, { useEffect } from 'react';
// import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   Row,
//   Col,
//   ListGroup,
//   Image,
//   Form,
//   Button,
//   Card,
// } from 'react-bootstrap';
// import Message from '../components/Message';
// import { addToCart, removeFromCart } from '../actions/cartActions';
 
// function CartScreen({ history }) {
//   const navigate = useNavigate()
//   const location = useLocation();
//   const params = useParams();
//   const productId = params.id;
//   const qty = location.search ? Number(location.search.split('=')[1]) : 1;
 
//   const dispatch = useDispatch();
 
//   const cart = useSelector((state) => state.cart);
//   const { cartItems } = cart;
//   console.log('cartItems:', cart);
 
//   useEffect(() => {
//     if (productId) {
//       dispatch(addToCart(productId, qty));
//     }
//   }, [dispatch, productId, qty]);
 
//   const removeFromCartHandler = (id) => {
//     dispatch(removeFromCart(id))
//   }
 
//   const checkoutHandler = () => {
//     navigate('/login?redirect=/shipping')
//   }
 
//   return (
//     <Row>
//       <Col md={8}>
//         <h1>Shopping Cart</h1>
//         {cartItems.length === 0 ? (
//           <Message variant='info'>
//             {' '}
//             Your cart is empty <Link to='/'>Go Back</Link>
//           </Message>
//         ) : (
//           <ListGroup variant='flush'>
//             {cartItems.map(item => (
//               <ListGroup.Item key={item.product}>
//                 <Row>
//                   <Col md={2}>
//                     <Image src={item.image} alt={item.name} fluid rounded/>
//                   </Col>
//                   <Col md={3}>
//                     <Link to={`/product/${item.product}/`}>{item.name}</Link>
//                   </Col>
//                   <Col md={2}>${item.price}</Col>
//                   <Col md={3}>
//                   <Form.Control
//                           as='select'
//                           value={item.qty}
//                           onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
//                         >
//                           {[...Array(item.countInStock).keys()].map((x) => (
//                             <option key={x + 1} value={x + 1}>
//                               {x + 1}
//                             </option>
//                           ))}
//                         </Form.Control>
//                   </Col>
//                   <Col md={1} >
//                     <Button type='button' variant='light' onClick={ () => removeFromCartHandler(item.product)}>
//                       <i className='fas fa-trash'/>
 
//                     </Button>
//                   </Col>
//                 </Row>
//               </ListGroup.Item>
//             ))}
//           </ListGroup>
//         )}
//       </Col>
//       <Col md={4}>
//         <Card>
//           <ListGroup variant='flush'>
 
//             <ListGroup.Item>
//               <h2>Subtotal ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}) items</h2>
//               ${cartItems.reduce((acc, item) => acc + Number(item.qty) * item.price, 0).toFixed(2)}
//             </ListGroup.Item>
//           </ListGroup>
//           <ListGroup.Item className='text-center'>
//             <Button type='button'
//             className='btn-block btn-lg col-10 m-3'
//               disabled={cartItems.length===0}
//               onClick={ checkoutHandler}>
//               Proceed to Checkout
//             </Button>
//           </ListGroup.Item>
//         </Card>
//       </Col>
//     </Row>
//   );
// }
 
// export default CartScreen;