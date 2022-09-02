import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import BuyForm from './BuyForm'
import SellForm from './SellForm'
import { useState } from 'react'

const Swap = ({ethBalance, tokenBalance, house, account}) => {
    const [currentForm, setCurrentForm] = useState('buy')
    const [showingTransactionMessage, setShowingTransactionMessage] = useState(false)
    const [error, setError] = useState(null)

    const buyTokens = async (etherAmount) => {
        setError(null)
        await house.buyTokens({ value: etherAmount, from: account })
        .catch(error => {
            console.error("Custom error handling: " + error?.data?.message);
            setError(error?.data?.message)
        });
      }
    
      const sellTokens = async (tokenAmount) => {
        setError(null)
        await house.sellTokens(tokenAmount)
        .catch(error => {
            console.error("Custom error handling: " + error?.data?.message);
            setError(error?.data?.message)
        });
      }
    const showTransactionMessage = () => {
        setShowingTransactionMessage(true)
    }

    let content
    if (currentForm === 'buy') {
        content = <BuyForm 
                        ethBalance={ethBalance}
                        tokenBalance={tokenBalance}
                        buyTokens={buyTokens}
                        showTransactionMessage={showTransactionMessage}
                    />
    } else if (currentForm === 'sell') {
        content = <SellForm
                        ethBalance={ethBalance}
                        tokenBalance={tokenBalance}
                        sellTokens={sellTokens}
                        showTransactionMessage={showTransactionMessage}
                    />
    }

    return (
        <div className="container-fluid mt-5">
            {error ? (
                <div>
                    <p className='mx-3 my-0' style={{color: "red"}}>{error}</p>
                </div>
            ) : (
                showingTransactionMessage ? (
                    <div>
                        <p className='mx-3 my-0'>Please follow the instructions on your wallet. The transaction may take few minutes to complete.</p>
                    </div>
                ) : (
                    <Row className="m-auto" style={{ maxWidth: '600px', background: "black" }}>
                        <Col className="col-4 mx-auto mb-4">
                            <button 
                                className="btn btn-light"
                                onClick={(event) => { setCurrentForm('buy') }}
                            >
                                Buy
                            </button>
                            <span className="text-muted">&lt; &nbsp; &gt;</span>
                            <button className="btn btn-light"
                                onClick={(event) => { setCurrentForm('sell') }}
                            >
                                Sell
                            </button>
                        </Col>
    
                        <Card className="mb-4" bg="dark">
                            <Card.Body>
                                {content}
                                <Row style={{color:"gray"}}>Please connect to the Polygon MATIC network with your wallet in order to house.</Row>
                            </Card.Body>
                        </Card>
                    </Row>
                )
            )}
        </div>
    );
}

export default Swap;