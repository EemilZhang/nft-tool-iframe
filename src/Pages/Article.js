import React from 'react';
import { Segment, Container, Icon, Header } from 'semantic-ui-react'
import './Article.css';

const articleTitles = ['What Are Crypto Collectibles?', 'Implementation And Integration', "Wider ERC721 Ecosystem"]
const articleContent = [
    (
        <div className='article-content'>
            <p>
                The best way of understanding what crypto collectibles are is to just ignore the 'crypto' prefix. 
            </p>
            <p>
                They are exactly like any other collectibles you might know, from Funko Pops to Baseball Cards. For example take Funko Pops, a brand that sells collectible plastic figurines, modeled after characters from popular culture (hence the 'Pop'). If you had to describe what they made, to someone unfamiliar with the brand, you might choose to describe them as "Plastic Collectibles".
            </p>
            <p>
                So why use the term crypto collectibles, rather than something a little less arcane, like 'Digital Collectibles'? The reason is that it specifies that the collectibles are made using blockchain technology (a term which 'crypto' has become almost synonymous with over the recent years). 
            </p>
            <p>
                For those unfamiliar with the core characteristics of blockchains, it essentially highlights the fact that the digital 'storage' of these items aren't isolated to a single server owned by a single company but instead distributed on a global decentralized network.
            </p>
            <p>
                In the context of why this is beneficial for both the collectors and the manufacturers of collectibles, a significant benefit is that the blockchain technology lays the foundation for building an online trading-based economy around the collectibles. 
            </p>
            <p>
                Both buyers and sellers of crypto collectibles can independently verify the authenticity of a collectible and avoid the risks usually associated with the sale of digital items (such as chargebacks, credit card fraud, etc.), and with the rise of marketplace platforms such as OpenSea.io, essentially eBay for crypto collectibles, these crypto transactions are becoming as seamless as any other digital transaction.
            </p>
            <p>
                In brief, crypto collectibles are a new medium for creating digital items that can easily be traded between parties. Unlike the trading of physical collectibles, which rely on a multi-step process of verifying authenticity, shipping, and payment,  the trading of crypto collectibles bundles all these into a single digital transaction. 
            </p>
        </div>
    )
]

const renderArticle = (articleId) => {
    return (
        <Container text>
            <Header as='h2'>
                {articleTitles[articleId]}
            </Header>
                {articleContent[articleId]}
        </Container>
    )
}

class Article extends React.Component {
    render() {

        if (this.props.activeItem !== 'Article') { return (<div/>) }
            
        return (
            <Segment basic style={{border: '0px', padding: '0px'}}>
                <div onClick={this.props.handleArticleClickBack} className='click-back-button' style={{marginTop: '1rem'}}>
                    <Icon name='left arrow'/> Back To Dashboard
                </div>
                <Segment basic attached style={{border: '0px'}}>
                    {renderArticle(this.props.activeArticle)}
                </Segment>
            </Segment>
        )
    }
}

export default Article