import React, {useEffect, useState} from 'react'
import {Link, useParams, useNavigate} from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, ListGroupItem, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import Loader from '../components/Loader'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

function OrderScreen() {


    let navigate = useNavigate();

    const orders  = useParams();
    const orderId  = orders.id;
    const dispatch = useDispatch();

    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const{order, error, loading} = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const{userInfo} = userLogin

    if(!loading && !error)
{
    order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
}

    // const addPayPalScript = () => {
    //     const script = document.createElement('script')
    //     script.type = 'text/javascript'
    //     script.src = 'https://www.paypal.com/sdk/js?client-id=AeDXja18CkwFUkL-HQPySbzZsiTrN52cG13mf9Yz7KiV2vNnGfTDP0wDEN9sGlhZHrbb_USawcJzVDgn'
    //     script.async = true
    //     script.onload = () => {
    //         setSdkReady(true)
    //     }
    //     document.body.appendChild(script)
    // }


    useEffect(() => {
        if(!userInfo){
            navigate('/login')
        }
        if(!order || successPay || order._id !== Number(orderId) || successDeliver ){
            dispatch({type:ORDER_PAY_RESET})
            dispatch({type:ORDER_DELIVER_RESET})
            dispatch(getOrderDetails(orderId))
        } else if(!order.isPaid){
            // if(!window.paypal){
            //     addPayPalScript()
            // }else{
                // if(window.paypal){
                setSdkReady(true)
                }
            // }
        }, [dispatch, order, orderId, successPay, successDeliver, navigate, userInfo])


    const successPaymentHandler = (paymentResult) =>{
        dispatch(payOrder(orderId, paymentResult))
        console.log(orderId, "sdad")
        setSdkReady(true)
    }


    const deliverHandler = () =>{
        dispatch(deliverOrder(order))
    }


  return loading ? (
        <Loader/>
  ): error ?(
    <Message variant='danger'>{error}</Message>
  ) : (
    <div>
            <h1> Order: {order._id} </h1>
      <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroupItem>
                    <h2>Shipping</h2>
                    <p>
                        <strong> Name: </strong> {order.user.name}
                    </p>
                    <p>
                        <strong> Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email }</a>
                    </p>
                    <p>
                        <strong>Shipping: </strong> 
                        {order.shippingAddress.address},
                        {'   '} {order.shippingAddress.city},
                        {'   '} {order.shippingAddress.postalCode},
                        {'   '} {order.shippingAddress.country}
                    </p>

                    {order.isDelivered ? (
                        <Message variant='success'> Delivered on {order.deliveredAt.substring(0, 19)}</Message>
                    ): (<Message variant='warning'> Not Delivered </Message>)
                    }

                </ListGroupItem>

                <ListGroupItem>
                    <h2>Payment Method</h2>
                    <p>
                        <strong>Method: </strong> 
                        {order.paymentMethod}
                    </p>
                    {order.isPaid ? (
                        <Message variant='success'> Paid on {order.paidAt.substring(0, 19)}</Message>
                    ): (<Message variant='warning'> Not Paid </Message>)
                    }
                </ListGroupItem>

                <ListGroupItem>
                    <h2>Order Items</h2>
                    {order.orderItems.length === 0 ? <Message variant='info'>
                        Order is empty
                    </Message>: (
                        <ListGroup variant='flush'>
                            {order.orderItems.map((item,index) =>(
                               <ListGroupItem key={index}>
                                <Row>
                                    <Col md={1}>
                                        <Image src={item.image} alt={item.name} fluid rounded/>
                                    </Col>
                                    <Col >
                                        <Link to={`/product/${item.product}`} > {item.name}</Link>
                                    </Col>
                                    <Col md={4}>
                                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                    </Col>
                                </Row>
                               </ListGroupItem>
                            ))}

                        </ListGroup>
                    )} 
                </ListGroupItem>

            </ListGroup>
        </Col>

        <Col md={4}>
            <Card>
                <ListGroup>
                <ListGroupItem variant='flush'>
                    <ListGroupItem>
                        <h2> Order Summary</h2>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Row>
                            <Col>
                                Items:
                            </Col>
                            <Col>
                                ${order.itemsPrice}
                            </Col>
                        </Row>
                    </ListGroupItem>

                    <ListGroupItem>
                        <Row>
                            <Col>
                                Shipping:
                            </Col>
                            <Col>
                                ${order.shippingPrice}
                            </Col>
                        </Row>
                    </ListGroupItem>


                    <ListGroupItem>
                        <Row>
                            <Col>
                                Tax:
                            </Col>
                            <Col>
                                ${order.taxPrice}
                            </Col>
                        </Row>
                    </ListGroupItem>

                    <ListGroupItem>
                        <Row>
                            <Col>
                                Total:
                            </Col>
                            <Col>
                                ${order.totalPrice}
                            </Col>
                        </Row>
                    </ListGroupItem>
                    </ListGroupItem>
                    {!order.isPaid && (
                        <ListGroupItem>
                            {loadingPay && <Loader />}

                            {!sdkReady ? (
                                <Loader/>
                            ) :(
                                <PayPalScriptProvider  options={{clientId: "Aex3GJgwAP1KtePNTWA7AMfkeuogGPTxfK3RS5scvlU7hIl1nJWNJLu1QKt0UbLaDkKTR7WpxSCjUULl"}}>
                                <PayPalButtons onApprove={successPaymentHandler} createOrder={(data,actions) => {
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    value: order.totalPrice
                                                }
                                            }
                                        ]
                                    })
                                }}/>
                                </PayPalScriptProvider>
                            )}
                      </ListGroupItem>
                    )}
           
                </ListGroup>
                {loadingDeliver && <Loader/>}
                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <ListGroupItem style={{textAlign: 'center'}}>
                        <Button type='button' className='btn btn-block' onClick={deliverHandler} style={{color: 'black'}}>
                            Mark As Deliver
                        </Button>
                    </ListGroupItem>
                )}
         
            </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OrderScreen
