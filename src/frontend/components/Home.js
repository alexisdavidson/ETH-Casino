import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import configContract from './configContract';

const Home = ({ account, token }) => {
    const [loading, setLoading] = useState(true)
    const [balance, setBalance] = useState("0")
    const [items, setItems] = useState([])

    const loadBalance = async () => {
        console.log("Finding balance of account " + account)
        console.log("Token has address " + token.address)
        setBalance((await token.balanceOf(account)).toString())
        setLoading(false)
    }

    const play = (item) => {

    }

    useEffect(() => {
        loadBalance()
    }, [])

    if (loading) return (
        <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
        </main>
    )

    return (
        <div className="flex justify-center">
            <div className="px-5 container">
                <p>Token Balance: {balance != null ? balance : "null"}</p>
            </div>

            {items.length > 0 ?
                <div className="px-5 container">
                    <Row xs={1} md={2} lg={4} className="g-4 py-5">
                        {items.map((item, idx) => (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    {/* <Card.Img variant="top" src={item.image} /> */}
                                    <Card.Body color="secondary">
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>
                                        {item.description}
                                    </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        <div className='d-grid'>
                                            <Button onClick={() => play(item)} variant="primary" size="lg">
                                                Play
                                            </Button>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            : (
                <main style={{ padding: "1rem 0" }}>
                    <h2>No listed games</h2>
                </main>
            )}
        </div>
    );
}
export default Home