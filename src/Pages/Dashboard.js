import React from 'react';
import { Segment, Button, Icon, Card, Placeholder, Loader, Image } from 'semantic-ui-react'
import './Dashboard.css';
import GetMetamaskImage from '../Assets/Brand_Assets/GetMetamask.png';

const ErrorMessage = (props) => {
    return (
        <div className="dashboard-error-box">
                <div className="dashboard-error-box-inner">
                    <div className="dashboard-error-box-inner-text">
                        <h2 className="dashboard-error-box-inner-text-h2">
                            {props.header}
                        </h2>
                        <p className="dashboard-error-box-inner-text-p">
                            {props.subheader}
                        </p>
                        {props.metamask === true && (
                            <a href={"https://metamask.io/"}>
                                {props.content}
                            </a>
                        )}
                        {props.metamask === false && (
                            <div>
                                {props.content}
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
    )
}

const Dashboard = (props) => {
    const { activeItem, web3, network, isLoading, web3Locked, showArticles } = props;
    
    if (activeItem !== 'Dashboard') {return(<div/>)}
    if (isLoading === true && web3 !== false && web3Locked !== true) {return(<div/>)}
    if (web3Locked === true) {
        return (
            <ErrorMessage
                header="This app requires a connected wallet"
                subheader="To get started please connect your MetaMask account."
                content={(<Button color='blue' onClick={props.unlockWeb3}>Connect Wallet</Button>)}
                metamask={false}
            />
        )
    }
    if (web3 === false) {
        return(
            <ErrorMessage
                header="This app requires an Ethereum wallet"
                subheader="To get started install the MetaMask browser extension."
                content={(<img src={GetMetamaskImage}  alt='Get Metamask' className="metamask-button"/>)}
                metamask={true}
            />
        )
    }

    if (network !== 1) {
        return(
            <ErrorMessage
                header="Looks like you're not on the mainnet"
                subheader="Connect to the Ethereum mainnet to get started."
                metamask={false}
            />
        )
    }

    const RenderTokens = () => {
        const EZNFTArray = props.EZNFTArray;
        const pendingTransaction = props.pendingTransaction;

        if (EZNFTArray === null) {
            return (
                <Segment attached loading placeholder>
                </Segment>
            )
        } else if (EZNFTArray.length === 0) {
            if (!pendingTransaction) {
                return (
                    <Card.Group itemsPerRow={4} doubling stackable style={{display: 'block'}}>
                            <Card link={false} key='createToken' onClick={props.createToken} className='mint-token-card'>
                                <Card.Content className='mint-token-content'>
                                    <div className='mint-token-header'>
                                        Create Token
                                    </div>
                                    <div className='mint-token-description'>
                                        <Icon name='add circle' size='large' className='mint-token-card-icon'/>
                                    </div>
                                </Card.Content>
                            </Card>
                    </Card.Group>
                )
            } else {
                return (
                        <Card.Group itemsPerRow={4} style={{display: 'block'}}>
                            <Card link raised id='pending'>
                                <Card.Content>
                                    <Placeholder>
                                        <Placeholder.Header>
                                            <Placeholder.Line length='short' />
                                            <Placeholder.Line length='very short' />
                                        </Placeholder.Header>
                                        <Placeholder.Paragraph>
                                            <Placeholder.Line length='medium' />
                                            <Placeholder.Line length='long' />
                                        </Placeholder.Paragraph>
                                    </Placeholder>
                                </Card.Content>
                            </Card>
                        </Card.Group>
                )
            }
        } else {
            const tokens = EZNFTArray.map(id => {
                if (props.EZNFTMetadata.hasOwnProperty(parseInt(id)) && props.shouldFetchMetadata === false) {
                    let token = props.EZNFTMetadata[parseInt(id)];
                    return (
                        <Card link raised key={id} onClick={() => props.handleTokenClick(id)} style={{ width: 'calc(100% - 2em)', margin: '1em 1em'}}>
                            <Card.Content >
                                {token.image && (
                                        <Image floated='right' size='mini' src={token.image} style={{maxHeight: '35px', maxWidth: '35px', height: '35px', width: '35px', objectFit: 'contain', backgroundColor: '#ffffff', border: '1px #fff9'}}/>   
                                )}
                                <Card.Header>{token.name ? token.name : 'Token ' + {id}}</Card.Header>
                                <Card.Meta># {id}</Card.Meta>
                                <Card.Description>
                                    {token.description ? token.description : ''}
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    )
                } else if (!props.EZNFTMetadata[id] && props.shouldFetchMetadata === false) {
                    return (
                        <Card link raised key={id} onClick={() => props.handleTokenClick(id)} style={{ width: 'calc(100% - 2em)', margin: '1em 1em'}}>
                            <Card.Content className='mint-token-image'>                        
                                <Card.Header style={{color: 'rgba(97, 92, 88, 0.42)'}}>Your Token</Card.Header>
                                <Card.Meta># {id}</Card.Meta>
                                <Card.Description style={{color: 'rgba(97, 92, 88, 0.91)'}}>
                                    Click this token to <br/> edit it and add metadata.
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    )
                } else {
                    return (
                        <Card link raised key={id} style={{ width: 'calc(100% - 2em)', margin: '1em 1em'}}>
                            <Card.Content >                        
                                <Card.Header></Card.Header>
                                <Card.Meta>Token {id}</Card.Meta>
                                <Card.Description>
                                    <Loader active inline='centered' />
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    )
                }
            })
            return (
                    <Card.Group itemsPerRow={4} doubling stackable style={{display: 'block'}}>
                        {tokens}
                        {!pendingTransaction && (
                            <Card link={false} key='createToken' onClick={props.createToken} className='mint-token-card' style={{ width: 'calc(100% - 2em)', margin: '1em 1em'}}>
                                <Card.Content className='mint-token-content'>
                                    <div className='mint-token-header'>
                                        Create Token
                                    </div>
                                    <div className='mint-token-description'>
                                        <Icon name='add circle' size='large' className='mint-token-card-icon'/>
                                    </div>
                                </Card.Content>
                            </Card>
                        )}
                        {pendingTransaction && (
                            <Card link raised id='pending' style={{ width: 'calc(100% - 2em)'}}>
                                <Card.Content>
                                    <Placeholder>
                                        <Placeholder.Header>
                                            <Placeholder.Line length='short' />
                                            <Placeholder.Line length='very short' />
                                        </Placeholder.Header>
                                        <Placeholder.Paragraph>
                                            <Placeholder.Line length='medium' />
                                            <Placeholder.Line length='long' />
                                        </Placeholder.Paragraph>
                                    </Placeholder>
                                </Card.Content>
                            </Card>
                        )}
                    </Card.Group>
            )
        }
    } 

    return(
            <React.Fragment>
                <div className='token-cards-container'>
                    <RenderTokens/>
                </div>
            </React.Fragment>
    )
}

export default Dashboard