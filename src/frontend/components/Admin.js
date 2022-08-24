import React, { Component } from 'react'
import { Row, Form, Col, Card, Button } from 'react-bootstrap'
import { ethers } from 'ethers'
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            output: '0'
        }
    }

  render() {
    return (
        <div className="container-fluid mt-5">
          <Row className="m-auto" style={{ maxWidth: '600px', background: "black" }}>
            <Col className="col-4 mx-auto mb-5">
                Bank balance (MATIC): {this.props.bankBalance} 
            </Col>

            <Card className="mb-4" bg="dark">
                <Card.Body>
                    <Form className="my-3" onSubmit={(event) => {
                        event.preventDefault()
                        this.props.withdrawBalance()
                    }}>
                    <Button type="submit" variant="primary" className="btn-block btn-lg">Withdraw</Button></Form>
                </Card.Body>
            </Card>
          </Row>
        </div>
      );
  }
}

export default Admin;