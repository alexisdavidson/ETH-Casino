import React, { Component } from 'react'
import { CardGroup, Form, InputGroup, Button } from 'react-bootstrap'
import { ethers } from 'ethers'
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

class BuyForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            output: '0'
        }
    }

  render() {
    return (
        <Form className="mb-3" onSubmit={(event) => {
            event.preventDefault()
            let etherAmount = this.input.value.toString()
            etherAmount = toWei(etherAmount, 'ether')
            this.props.buyTokens(etherAmount)
        }}>
            <div style={{textAlign:"left"}}>
                Balance: {fromWei(this.props.ethBalance, 'ether')}
            </div>
            <InputGroup className="mb-4">
                <Form.Control
                    placeholder="0"
                    aria-label="Eth Amount"
                    onChange={(event) => {
                        const etherAmount = this.input.value.toString()
                        this.setState({ output: etherAmount * 100 })
                        console.log(this.state.output)
                    }}
                    ref={(input) => { this.input = input}}
                    className="form-control form-control-lg"
                    required 
                    aria-describedby="basic-addon2"
                />
                <InputGroup.Text id="basic-addon2">
                    <img src={tokenLogo} height='32' alt="" />
                    &nbsp;&nbsp;&nbsp; ETH
                </InputGroup.Text>
            </InputGroup>
            <div style={{textAlign:"left"}}>
                Balance: {fromWei(this.props.tokenBalance, 'ether')}
            </div>
            <InputGroup className="mb-2">
                <Form.Control
                    placeholder="0"
                    className="form-control form-control-lg"
                    value={this.state.output}
                    disabled
                />
                <InputGroup.Text id="basic-addon2">
                    <img src={ethLogo} height='32' alt="" />
                    &nbsp;&nbsp;&nbsp; PGM
                </InputGroup.Text>
            </InputGroup>
            <div className="mb-5">
                1 ETH = 100 PGM
            </div>
            <Button type="submit" variant="primary" className="btn-block btn-lg">Sell</Button>
        </Form>
      );
  }
}

export default BuyForm;