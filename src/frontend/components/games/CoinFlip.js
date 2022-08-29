import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Button } from 'react-bootstrap'
import tokenLogo from '../../img/token-logo.png'

const toWei = (num) => ethers.utils.parseEther(num.toString())

const CoinFlip = ({coinflip}) => {
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState(null)
    const [bet, setBet] = useState(1)
    const [error, setError] = useState(null)

    const resultText = () => {
        return result
    }

    const playBet = async (_bet) => {
        setError(null)
        setBet(_bet)
        console.log("Play with bet " + _bet)
        await coinflip.play(toWei(_bet))
        .catch(error => {
            console.error("Custom error handling: " + error?.data?.message);
            setError(error?.data?.message)
        });
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
        <div className="container-fluid mt-4">
            <Row className="m-auto">
                <Col className="col-6 mx-auto mb-4">
                    <h2>Coin Flip</h2>
                    <img src={tokenLogo} alt="" className="mt-4"/>
                    <Row xs={1} md={2} lg={4} className="g-4 py-5 mx-auto">
                        {result != null ? (
                            <p style={{width: "100%"}}>Result: {resultText}</p>
                        ) : (
                            <p style={{width: "100%"}}>Double your coins!</p>
                        )}
                    </Row>
                    <Row xs={1} md={2} lg={4} className="g-4 mx-auto">
                        <Button onClick={() => playBet(1)} variant="primary" size="lg" style={{width: "30%"}} className="mx-2">
                            Bet 1 Coins
                        </Button>
                        <Button onClick={() => playBet(5)} variant="primary" size="lg" style={{width: "30%"}} className="mx-2">
                            Bet 5 Coins
                        </Button>
                        <Button onClick={() => playBet(10)} variant="primary" size="lg" style={{width: "30%"}} className="mx-2">
                            Bet 10 Coins
                        </Button>
                        <Button onClick={() => playBet(50)} variant="primary" size="lg" style={{width: "30%"}} className="mx-2">
                            Bet 50 Coins
                        </Button>
                        <Button onClick={() => playBet(100)} variant="primary" size="lg" style={{width: "30%"}} className="mx-2">
                            Bet 100 Coins
                        </Button>
                        <Button onClick={() => playBet(500)} variant="primary" size="lg" style={{width: "30%"}} className="mx-2">
                            Bet 500 Coins
                        </Button>
                    </Row>
                    <Row xs={1} md={2} lg={4} className="g-4 py-4 mx-auto">
                        {error != null ? (
                            <p style={{width: "100%"}}>{error}</p>
                        ) : (
                            <div></div>
                        )}
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
export default CoinFlip