import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navigation from '../components/Navigation';
import axios from 'axios';
import { Client, Databases, ID, Query } from "appwrite";

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [storeInfo, setStoreInfo] = useState({});
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState([]);
    const [input, setInput] = useState('')

    useEffect(() => {
        const getStoreInfo = async () => {
            const res = await axios.get('http://localhost:8080/store')
            setStoreInfo(res.data.body)
        }
        const getProducts = async () => {
            const res = await axios.get('http://localhost:8080/products')
            setProducts(res.data.body)
        }
        const getImages = async () => {
            const res = await axios.get('http://localhost:8080/database')
            let data = res.data.body
            console.log(data);
            setImages(data)
        }
        getImages()
        getStoreInfo()
        getProducts()
    }, [])

    const createPic = async () => {
        if (!input) {
            return alert("Please Enter a Prompt")
        }

        try {
            const res = await fetch('http://localhost:8080/imagination', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    input,
                })
            })
            const data = await res.json();
            const imageUrl = data.photo;

            if (data) {
                try {
                    //console.log("Going for 2!  : ", imageUrl);
                    const response = await fetch('http://localhost:8080/generate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            imageUrl,
                        })
                    })
                    const genData = await response.json();
                    if (genData) {
                        console.log("Wait for 10 seconds...");
                        setTimeout(async () => {
                            try {
                                const task = genData.task_key;
                                const response = await fetch(`http://localhost:8080/mockup/${task}`, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                })
                                const mockups = await response.json();
                                console.log(mockups.images);
                                if (mockups) {
                                    const previewImage = mockups.images.mockup_url
                                    try {
                                        console.log("Going for 4!  : ", previewImage);
                                        const response = await fetch('http://localhost:8080/create', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                file: previewImage, // Need to change back
                                                preview: previewImage,
                                            })
                                        })
                                        const created = await response.json();
                                        console.log(created);
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }
                            } catch (error) {
                                console.log(error)
                            }
                        }, 15000)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setInput('')
        }
    }

    return (
        <>
            <Navigation />
            <Container
                fluid="md"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>
                <button onClick={createPic}>click</button>
                <input type='text' value={input} onChange={(e) => setInput(e.target.value)} placeholder='Enter Prompt' style={{ width: '400px' }}></input>
                <Row>
                    <Col> <h1>{storeInfo.name}</h1></Col>
                </Row>
                <Row >
                    <Col >
                        <Card style={{
                            height: '200px',
                            width: '300px',
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap'
                        }} >
                            <Card.Body>New Items Added Daily!</Card.Body>
                            {images.map((img, index) => {
                                return <Card.Img
                                    key={index}
                                    src={img.image_url}
                                    alt='pic'
                                    style={{
                                        height: '180px',
                                        objectFit: 'contain'
                                    }} />
                            })}

                        </Card>
                    </Col>
                </Row>

                <hr style={{ width: '100%' }}></hr>

                <Row xs={1} sm={2} md={3} className="g-4">
                    {products.map((e) => {
                        return <Col key={e.id}>
                            <Card style={{ boxShadow: '2px 2px 4px rgba(0,0,0,0.25)' }}>
                                <Card.Img variant="top" src={e.thumbnail_url} />
                                <Card.Body className='text-center'>
                                    <Card.Title>{e.name}</Card.Title>
                                    <Card.Text>
                                        {e.id}
                                    </Card.Text>
                                    <Button variant="primary">Add To Cart</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    })}
                </Row>
            </Container>


        </>
    )
}

export default Home