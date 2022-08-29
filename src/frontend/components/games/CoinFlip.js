import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'

const toWei = (num) => ethers.utils.parseEther(num.toString())

const CoinFlip = ({coinflip}) => {
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState(null)
    const [bet, setBet] = useState(0.1)

    const resultText = () => {
        return result
    }

    const play = async () => {
        console.log("Play with bet " + bet)
        await coinflip.play(toWei(bet));
    }

    const loadGame = () => {
        setLoading(false)
    }

    useEffect(() => {
        loadGame()
    }, [])

    if (loading) return (
        <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
        </main>
    )

    return (
        <div className="container-fluid mt-5">
            <Row className="m-auto">
                <Col className="col-4 mx-auto mb-4">
                    <h2>Coin Flip</h2>
                    <Row xs={1} md={2} lg={4} className="g-4 py-5 mx-auto">
                        {result != null ? (
                            <p style={{width: "100%"}}>Result: {resultText}</p>
                        ) : (
                            <p style={{width: "100%"}}>Double your coins!</p>
                        )}
                    </Row>
                    <Row xs={1} md={2} lg={4} className="g-4 py-5 mx-auto">
                        <Button onClick={() => play()} variant="primary" size="lg" style={{width: "100%"}}>
                            Bet {bet} Coins
                        </Button>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
export default CoinFlip