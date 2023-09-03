import React, {useState} from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'


function SearchBox() {


    const [keyword, setKeyword] = useState('')

    let navigate = useNavigate()
   
    const submitHandler = (e) => {
        e.preventDefault()
    
        if(keyword){
            navigate(`?keyword=${keyword}&page=1`)
        }else{
            navigate(navigate)
        }
    }
  return (
   <Form onSubmit={submitHandler} style={{display:'flex', marginRight:'20rem', paddingRight:'20rem'}}>
        <Form.Control type='text' name='keyword' onChange={(e) => setKeyword(e.target.value)} className='mr-sm-2 ml-sm-5'>
        </Form.Control>
        <Button type='submit' variant='outline-success' className='p-2'>
            Submit
        </Button>
        
   </Form>
  )
}

export default SearchBox
