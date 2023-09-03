import React , {useEffect} from 'react'
import { Row, Col } from 'react-bootstrap'
import Product  from '../components/Product'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ProductCarousel from '../components/ProductCarousel'

function HomeScreen() {

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const pageN = searchParams.get('page');

  // const location = useLocation();
  // let keyword = location.search
  // keyword = keyword.split('&')[0].split('?keyword=')[0]



  const dispatch = useDispatch()
  const productList = useSelector(state => state.productList)
  const {error, loading, products, page, pages} = productList

  useEffect(()=> {
    dispatch(listProducts(keyword, pageN))

  }, [dispatch, keyword, pageN])

  return (
    <div>
      {!keyword && <ProductCarousel />}
      
      <h1>Latest Products</h1>
      {loading ? <Loader />
        : error ? <Message variant='danger'>{error}</Message>
        :
        <div>
        <Row>
        {products.map(product=> (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
            </Col>
        ))}
        </Row>
    
        <Paginate pages={pages} page={page} keyword={keyword} />
        </div>
      }
      
    </div>
  )
}

export default HomeScreen
