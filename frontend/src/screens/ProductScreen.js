import React, {useEffect, useState} from 'react'
import { Link, useParams, useNavigate} from  'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, ListGroupItem, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'




function ProductScreen() {
    let navigate = useNavigate();
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const { id } = useParams();
    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const {loading, error, product} = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const {loading: loadingProductReview, error: errorProductReview , success: successProductReview} = productReviewCreate
    

    useEffect(()=> {

        if(successProductReview){
            setRating(0)
            setComment('')
            dispatch({type:PRODUCT_CREATE_REVIEW_RESET})
        }
        dispatch(listProductDetails(id))
    }, [dispatch, id, successProductReview])

    const addToCartHandler = () =>{
        navigate(`/cart/${id}?qty=${qty}`)

    }

    const submitHandlre = (e) =>{
        e.preventDefault()
        dispatch(createProductReview(
            id, {
            rating,
            comment
            }
        ))
    }

  return (
    <div>
      <Link to='/' className='btn btn-dark my-3'>Go Back</Link>

        {loading ? <Loader />
            : error 
            ? <Message variant='danger'>{error}</Message>
            :(
                <div> 
                <Row>
                <Col md={6}>
                <Image src={product.image} alt={product.name} fluid/>
                </Col>
                <Col md={3}>
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <h3>{product.name}</h3>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'}/>
                        </ListGroupItem>
        
                        <ListGroupItem>
                            Price: ${product.price}
                        </ListGroupItem>
        
                        <ListGroupItem>
                            Description: {product.description}
                        </ListGroupItem>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroupItem>
                                <Row>
                                    <Col>Price:</Col>
                                    <Col>
                                        <strong>${product.price}</strong>
                                    </Col>
                                </Row>
                            </ListGroupItem>
        
                            <ListGroupItem>
                                <Row>
                                    <Col>Status:</Col>
                                    <Col>
                                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </Col>
                                </Row>
                            </ListGroupItem>

                            {product.countInStock > 0 && (
                                <ListGroupItem>
                                <Row>
                                    <Col>Qty:</Col>
                                    <Col xs= 'auto'className='my-1' style={{marginRight: "5rem"}}>
                                        <Form.Control as="select" value={qty} onChange={(e) => setQty(e.target.value)} >
                                            {
                                                [...Array(product.countInStock).keys()].map((x) =>(
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))
                                            }

                                        </Form.Control>
                                    </Col>
                                </Row>
                                </ListGroupItem>
                            )}

        
                            <ListGroupItem>
                               <Button onClick={() => addToCartHandler()} className='btn-block'  disabled={product.countInStock === 0} type='button' style={{textAlign: "center", width: "250px", marginLeft: "5px"}} >Add To Cart</Button>
                            </ListGroupItem>
        
                        </ListGroup>
                    </Card>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                    <h4> REVIEWS </h4>
                    {product.reviews.length === 0 && <Message variant='info'>No Reviews </Message>}
                    <ListGroup variant='flush'>
                           {product.reviews.map((review) =>(
                            <ListGroupItem key={review._id}>
                                <strong>{review.name}</strong>
                                <Rating value={review.rating} color='#f8e825'/>
                                <p>{review.createdAt.substring(0, 10)}</p>
                                <p>{review.comment}</p>
                            </ListGroupItem>
                           ))}
                            <ListGroupItem>
                                <h4>WRITE A REVIEW</h4>
                                    {loadingProductReview && <Loader/>}
                                    {successProductReview && <Message variant='success'>Review Submitted</Message>}
                                    {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                                {userInfo ? (
                                    <Form onSubmit={submitHandlre}>
                                        <Form.Group controlId='rating'>
                                            <Form.Label> Rating</Form.Label>
                                            <Form.Control as='select' value={rating} onChange={(e)=> setRating(e.target.value)}>
                                                <option value=''> Select...</option>
                                                <option value='1'> 1 - Poor</option>
                                                <option value='2'> 2 - Fair</option>
                                                <option value='3'> 3 - Good</option>
                                                <option value='4'> 4 - Very Good</option>
                                                <option value='5'> 5 - Excellent</option>
                                            </Form.Control>
                                        </Form.Group>

                                        <Form.Group controlId='comment'>
                                            <Form.Label> Review</Form.Label>
                                            <Form.Control as='textarea' row='6' value={comment} onChange={(e)=> setComment(e.target.value)}>
                                            </Form.Control>
                                        </Form.Group>

                                        <Button disabled={loadingProductReview} type='submit' variant='primary' style={{width: '80px', height:'30px', margin: '10px 0' , padding:'0'}}>
                                            Submit
                                        </Button>
                                    </Form>
                                ): (
                                    <Message variant='info'>
                                        Please <Link to='/login'>Login</Link> to write a review.
                                    </Message>
                                )}
                            </ListGroupItem>
                    </ListGroup>
                </Col>
              </Row>
            </div>
            )

        }
    
    </div>
  )
}

export default ProductScreen
