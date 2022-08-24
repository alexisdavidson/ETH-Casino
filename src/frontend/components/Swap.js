import React, { Component } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { ethers } from 'ethers'
import BuyForm from './BuyForm'
import SellForm from './SellForm'

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

class Swap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentForm: 'buy'
        }
    }

  render() {
    let content
    if (this.state.currentForm === 'buy') {
        content = <BuyForm 
                        ethBalance={this.props.ethBalance}
                        tokenBalance={this.props.tokenBalance}
                        buyTokens={this.props.buyTokens}
                    />
    } else {
        content = <SellForm
                        ethBalance={this.props.ethBalance}
                        tokenBalance={this.props.tokenBalance}
                        sellTokens={this.props.sellTokens}
                        withdrawBalance={this.props.withdrawBalance}
                    />
    }

    return (
        <div className="container-fluid mt-5">
          <Row className="m-auto" style={{ maxWidth: '600px', background: "black" }}>
            <Col className="col-4 mx-auto mb-4">
                <button 
                    className="btn btn-light"
                    onClick={(event) => {
                        this.setState({ currentForm: 'buy'})
                    }}
                >
                    Buy
                </button>
                <span className="text-muted">&lt; &nbsp; &gt;</span>
                <button className="btn btn-light"
                    onClick={(event) => {
                        this.setState({ currentForm: 'sell'})
                    }}
                >
                    Sell
                </button>
            </Col>

            <Card className="mb-4" bg="dark">
                <Card.Body>
                    {content}
                </Card.Body>
            </Card>
          </Row>
        </div>
      );
  }
}

export default Swap;