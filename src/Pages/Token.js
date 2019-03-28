import React from 'react';
import { Segment, Button, Confirm, Icon, Header, Card, Popup, Form, Input, Image, Label, TextArea, List, Divider, Grid } from 'semantic-ui-react'
import './Token.css';
import Axios from 'axios';
import signTokenMetadata from '../Utility/signTokenMetadata';

class Token extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isImagePopupOpen: false,
            imagePreviewUrl: 'https://react.semantic-ui.com/images/wireframe/image.png',
            tokenImage: '',
            tokenName: '',
            tokenUrl: '',
            tokenDescription: '',
            confirmOpen: false,
            confirmSelect: false,
            file: null,
            noFile: true,
            isMetadataUpdating: false
        }

        this.myRef = React.createRef();

        this.handleImagePopup = this.handleImagePopup.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleConfirmSelect = this.handleConfirmSelect.bind(this);

        this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this);
    }

    componentDidUpdate = () => {
        if (this.state.file) {
            if (this.state.noFile === true) {
                this.setState({noFile: false});
            }
        }
    }

    handleImagePopup = (popup) => {this.setState({isImagePopupOpen: popup})}

    handleImageChange = (e) => {
        e.preventDefault();
        this.setState({isImagePopupOpen: false })
    
        let reader = new FileReader();
        let file = e.target.files[0];
        let imageType = /image.*/;
    
        if (file.type.match(imageType)) {
          reader.onloadend = () => {
              console.log(file);
            this.setState({ file: file, filetype: file.type, imagePreviewUrl: reader.result, isImagePopupOpen: false});
          }
          reader.readAsDataURL(file)
        } else {
          file = null;
          alert('This is not an image file');
        }
      }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleConfirm = () => {
        this.setState({confirmOpen: (this.state.confirmOpen ? false : true)})
    }

    handleConfirmSelect = () => {
        this.setState({confirmSelect: true, confirmOpen: false});
    }

    handleSubmitUpdate = async(event) => {
        event.preventDefault();

        this.setState({isMetadataUpdating: true})

        const tokenMetadata = {
            id: this.props.activeToken,
            name: this.state.tokenName,
            external_url: 'http://' + this.state.tokenUrl,
            description: this.state.tokenDescription,
        }

        const imageInfo = {
            id: this.props.activeToken,
            hasImage: false
        }

        if (this.state.file) {
            tokenMetadata.image = 'https://eznft-images.etherzaar.com/' + this.props.activeToken;
            imageInfo.hasImage = true;
            imageInfo.fileType = this.state.file.type;
        }

        
        signTokenMetadata(this.props.web3, this.props.account, JSON.stringify(tokenMetadata))
          .then((signature) => {

            const body = {
                signature: signature,
                rawMessage: JSON.stringify(tokenMetadata),
                image: JSON.stringify(imageInfo)
            }
            Axios.post('https://eznft-metadata.etherzaar.com/v1/metadata', body)
                .then((response) => {
                    if (imageInfo.hasImage === true) {
                        if (response.data.image.signedS3Url.state === true) {
                            Axios.put(response.data.image.signedS3Url.signedRequest, this.state.file, {
                                headers: {
                                    'Content-Type': this.state.file.type
                                }
                            })
                            .then(result => {
                                this.setState({isMetadataUpdating: false, imagePreviewUrl: 'https://react.semantic-ui.com/images/wireframe/image.png'})
                                this.props.triggerAppUpdate(this.props.activeToken, tokenMetadata);
                            })
                            .catch(error => {
                                this.setState({isMetadataUpdating: false, imagePreviewUrl: 'https://react.semantic-ui.com/images/wireframe/image.png'})
                                this.props.triggerAppUpdate(this.props.activeToken, tokenMetadata);
                            });
                        } else {
                            this.setState({isMetadataUpdating: false, imagePreviewUrl: 'https://react.semantic-ui.com/images/wireframe/image.png'})
                            this.props.triggerAppUpdate(this.props.activeToken, tokenMetadata);
                        }
                    } else {
                        this.setState({isMetadataUpdating: false, imagePreviewUrl: 'https://react.semantic-ui.com/images/wireframe/image.png'})
                        this.props.triggerAppUpdate(this.props.activeToken, tokenMetadata);
                    }

                })
                .catch((error) => {
                    this.setState({isMetadataUpdating: false})
                });

          })
          .catch((error) => {
              this.setState({isMetadataUpdating: false})
          });
    }

    render() {
        var tokenMetadata = this.props.EZNFTMetadata[parseInt(this.props.activeToken)];

        if (this.props.activeItem !== 'Token') { return (<div/>) }

        if (this.props.EZNFTMetadata.hasOwnProperty(parseInt(this.props.activeToken)) ) {
            var tokenHasImage = tokenMetadata.hasOwnProperty('image');
            return (
                <React.Fragment>
                    <div onClick={this.props.handleTokenClickBack} className='click-back-button' style={{marginTop: '-1.1em', marginLeft: '-0.2em'}}>
                        <Icon name='left arrow'/> Back
                    </div>
                            <Card style={{padding: '0.2em 0em 0em 0em', marginTop: '0.5em'}}>
                                <div ref={this.myRef}/>
                                { tokenHasImage && (
                                    <Image src={tokenMetadata.image} style={{maxHeight: '240px', width: 'auto', objectFit: 'contain', backgroundColor: '#ffffff'}}/>
                                )}
                                <Card.Content>
                                    <Header as='h4' className='card-metadata-header-old'>
                                        Token Name
                                        <Header.Subheader content={tokenMetadata.name}/>
                                    </Header>

                                    <Header as='h4' style={{marginTop: '0px'}} className='card-metadata-header-old'>
                                        External Url
                                        <Header.Subheader as='a' content={tokenMetadata.external_url} href={tokenMetadata.external_url}/>
                                    </Header>

                                    <Header as='h4' style={{marginTop: '0px'}} className='card-metadata-header-old'>
                                        Description
                                        <Header.Subheader content={tokenMetadata.description}/>
                                    </Header>

                                </Card.Content>
                            </Card>
                </React.Fragment>
            )
        }

        if (!this.props.EZNFTMetadata.hasOwnProperty(parseInt(this.props.activeToken)) && this.props.isIframe === true) {
            return (
                <div className='edit-token-metadata-card'>
                    <div style={{padding: '0.2em 0em 0em 0em', marginTop: '-1.3em'}}>
                        <div onClick={this.props.handleTokenClickBack} className='click-back-button' style={{}}>
                        <Icon name='left arrow'/> Back
                    </div>

                        <Segment color='blue' style={{marginTop: '0.3em'}}>
                            <Grid columns='equal'>
                                <Grid.Column>
                                    <Card link={false} key='createToken' className='mint-token-card' style={{margin: '0px 0px 0px 0px', paddingBottom: '1px', width: '100px', height: '90px'}}>
                                        {this.state.file && (
                                            <Image src={this.state.imagePreviewUrl} style={{maxWidth: '100px', maxHeight: '86px', width: 'auto', objectFit: 'contain', backgroundColor: '#ffffff'}}/>
                                        )}
                                        {!this.state.file && (
                                            <Card.Content className='mint-token-content' >
                                                <div className='mint-token-header' style={{lineHeight: '1.2rem', marginTop: '0px', fontSize: '1rem'}}>
                                                    Upload Image
                                                </div>
                                                <div className='mint-token-description' style={{marginBottom: '0px'}}>
                                                    <Icon name='upload' size='large' className='mint-token-card-icon'/>
                                                </div>
                                            </Card.Content>
                                        )}
                                        
                                        <input type="file" onChange={this.handleImageChange}/>
                                    </Card>
                                </Grid.Column>
                                <Grid.Column >
                                    <Header 
                                        as='h4'
                                        className='card-metadata-header-new'
                                        style={{marginTop: '-3px', marginBottom: '0em', marginLeft: '-14px', fontSize: '1rem'}}
                                    >
                                    Token Name
                                    </Header>
                                    <Input className='input-wrapper' placeholder='My Token' name='tokenName' fluid onChange={this.handleChange} size='mini' style={{marginTop: '0.1em', marginLeft: '-14px'}}/>

                                    <Header 
                                        as='h4'
                                        className='card-metadata-header-new'
                                        style={{marginTop: '3px', marginBottom: '0em', marginLeft: '-14px', fontSize: '1rem'}}
                                    >
                                    External Url
                                    </Header>
                                    
                                    <Input className='input-wrapper' size='mini' name='tokenUrl' onChange={this.handleChange}  placeholder='yoursite.com/token' fluid style={{marginTop: '0.1em', marginLeft: '-14px'}}/>
    
                                </Grid.Column>
                            </Grid>
                            <Divider/>
                            <Header 
                                as='h4'
                                className='card-metadata-header-new'
                                style={{marginTop: '-0.6em', marginBottom: '0.4em', fontSize: '1rem'}}
                            >
                            Description
                            </Header>
                            <Form>
                                <TextArea rows={1} className='input-wrapper' placeholder='Token description...' name='tokenDescription' onChange={this.handleChange} style={{resize: 'none'}}/>
                            </Form>
                            <Divider/>
                            <Button 
                                color='blue' 
                                fluid
                                onClick={(this.state.file || this.state.confirmSelect)? this.handleSubmitUpdate: this.handleConfirm}
                                style={{marginTop: '0.2em'}}
                            >
                                Add Metadata
                            </Button>
                            <Confirm open={this.state.confirmOpen} content='You have not uploaded an image, are you sure you want to create a token without one?' onCancel={this.handleConfirm} onConfirm={this.handleSubmitUpdate} />

                        </Segment>
                                    
                                    
                        </div>
                        
                </div>
            )
        }
        
        if (!this.props.EZNFTMetadata.hasOwnProperty(parseInt(this.props.activeToken))) {
            return (
                <div>
                    <div onClick={this.props.handleTokenClickBack} className='click-back-button' style={{marginTop: '1rem'}}>
                        <Icon name='left arrow'/> Back To Dashboard
                    </div>
    
                    <Segment basic attached loading={this.state.isMetadataUpdating} style={{border: '0px'}}>
                        <Card.Group centered>
                            <Card>
                                <div ref={this.myRef}/>
                                <Popup
                                    trigger={this.state.file ? (<Image src={this.state.imagePreviewUrl} style={{maxHeight: '240px', width: 'auto', objectFit: 'contain', backgroundColor: '#bcbec0'}}/>) : (<Image src={this.state.imagePreviewUrl} label={{as: 'a', color: 'blue', corner: 'right', icon: 'save'}} style={{maxHeight: '240px', width: 'auto', objectFit: 'contain', backgroundColor: '#bcbec0'}}/>)}
                                    content={<input type='file' onChange={this.handleImageChange}/>}
                                    context={this.myRef.current}
                                    open={this.state.isImagePopupOpen}
                                    onOpen={() => this.handleImagePopup(true)}
                                    onClose={() => this.handleImagePopup(false)}
                                    on='click'
                                    position='top left'
                                />
                            <Card.Content>
                                <Card.Header className='card-main-header'>
                                    Features
                                </Card.Header>
                                <Card.Description>
        
                                <Popup style={{color: 'rgba(0,0,0,.6)'}} trigger={<h5 style={{cursor: 'default', fontSize: '0.95rem', margin: '20px 0px'}}><Icon name='cube'/> One-click deployment</h5>} content='Tokens are instantly deployed with no overhead.' />
                                <Popup style={{color: 'rgba(0,0,0,.6)'}} trigger={<h5 style={{cursor: 'default', fontSize: '0.95rem', margin: '20px 0px'}}><Icon name='cube'/> Fully hosted metadata</h5>} content='No need to worry about setting up a custom api server for metadata, we manage that on our end.' />
                                <Popup style={{color: 'rgba(0,0,0,.6)'}} trigger={<h5 style={{cursor: 'default', fontSize: '0.95rem', margin: '20px 0px'}}><Icon name='cube'/> Instantly trade on Opensea.io</h5>} content='Tokens are fully integrated on the Opensea marketplace.' />
                                <Popup style={{color: 'rgba(0,0,0,.6)'}} trigger={<h5 style={{cursor: 'default', fontSize: '0.95rem', margin: '20px 0px'}}><Icon name='cube'/> No-fee minting</h5>} content='You only pay for the gas fees to mint your token.' />
        
                                </Card.Description>
                            </Card.Content>
        
                            </Card>
                            <Card style={{maxHeight: '460.05px'}}>
                                <Card.Content>
                                        <Header 
                                            as='h4'
                                            className='card-metadata-header'
                                        >
                                            Token Name
                                        <Header.Subheader
                                            content='The name of your token.'
                                        />
                                        </Header>

                                        <Input placeholder='My Token' name='tokenName' onChange={this.handleChange} fluid/>
        
                                        <Header 
                                            as='h4'
                                            className='card-metadata-header'
                                            style={{marginTop: '1.2rem'}}
                                        >
                                        External Url
                                        <Header.Subheader
                                            content='What, if anything, you want your token to link to.'
                                        />
                                        </Header>
                                        
                                        <Input label={<Label style={{color: 'rgba(52, 134, 208, 0.89)'}}>http://</Label>} name='tokenUrl' onChange={this.handleChange}  placeholder='yoursite.com/yourtoken' fluid/>
        
                                        <Header 
                                            as='h4'
                                            className='card-metadata-header'
                                            style={{marginTop: '1.2rem'}}
                                        >
                                        Description
                                        <Header.Subheader
                                            content='Any additional information you want to include with your token.'
                                        />
                                        </Header>
                                        <Form>
                                            <TextArea placeholder='Token description...' name='tokenDescription' onChange={this.handleChange} style={{resize: 'none'}}/>
                                        </Form>
                                    </Card.Content>
                                <Card.Content extra >
                                    <Button 
                                        floated='right' 
                                        compact color='blue' 
                                        style={{ backgroundColor: '#63bd7c'}}
                                        onClick={(this.state.file || this.state.confirmSelect)? this.handleSubmitUpdate: this.handleConfirm}
                                    >
                                    Create Token</Button>
                                    <Confirm open={this.state.confirmOpen} content='You have not uploaded an image, are you sure you want to create a token without one?' onCancel={this.handleConfirm} onConfirm={this.handleSubmitUpdate} />

                                </Card.Content>
                            </Card>
                        </Card.Group>
                    </Segment>
                </div>
            )
        }
    }
}

export default Token