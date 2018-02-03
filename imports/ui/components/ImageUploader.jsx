import React, {PropTypes} from 'react';
import ReactDom from "react-dom";
import BaseComponent from '../components/BaseComponent.jsx';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';
import {Row} from 'react-flexbox-grid';

const dataURIPrefixPattern = new RegExp(/data:image\/\w{1,5};base64,\s*/);

export function isDataURL(s) {
    return !!s.match(dataURIPrefixPattern);
}

export const FileUpload = React.createClass({

    handleFile: function(e) {
        let reader = new FileReader();
        let file = e.target.files[0];

        if (!file) return;

        reader.onload = function(img) {
            ReactDom.findDOMNode(this.refs.in).value = '';
            this.props.handleFileChange(img.target.result);
        }.bind(this);
        reader.readAsDataURL(file);
    },

    render: function() {
        return (
            <input
                ref="in"
                type="file"
                accept="image/*"
                onChange={this.handleFile}
                style={{
                    "position": "absolute",
                    "left": 0,
                    "top": 0,
                    "bottom": 0,
                    "right": 0,
                    "opacity": 0,
                    "zIndex": 9,
                    "cursor": "pointer",
                    "width": "100%",
                    "height": "100%",
                }}
            />
        );
    }
});

FileUpload.PropTypes = {
    handleFileChange: PropTypes.func.isRequired
};

class Cropper extends BaseComponent {

    constructor () {
        super();

        // getInitialState
        this.state = {
            dragging: false,
            image: {},
            mouse: {
                x: null,
                y: null
            },
            preview: null,
            zoom: 1
        };

        this.listeners = [];

    }

    fitImageToCanvas (width, height) {
        let scaledHeight, scaledWidth;

        const canvasAspectRatio = this.props.height / this.props.width;
        const imageAspectRatio = height / width;

        if (canvasAspectRatio > imageAspectRatio) {
            scaledHeight = this.props.height;
            let scaleRatio = scaledHeight / height;
            scaledWidth = width * scaleRatio;
        } else {
            scaledWidth = this.props.width;
            let scaleRatio = scaledWidth / width;
            scaledHeight = height * scaleRatio;
        }

        return { width: scaledWidth, height: scaledHeight };
    }

    prepareImage (imageUri) {
        const img = new Image();
        if (!isDataURL(imageUri)) img.crossOrigin = 'anonymous';
        img.onload = () => {
            const scaledImage = this.fitImageToCanvas(img.width, img.height);
            scaledImage.resource = img;
            scaledImage.x = 0;
            scaledImage.y = 0;
            this.setState({dragging: false, image: scaledImage, preview: this.toDataURL()});
        };
        img.src = imageUri;
    }

    mouseDownListener () {
        this.setState({
            image: this.state.image,
            dragging: true,
            mouse: {
                x: null,
                y: null
            }
        });
    }

    preventSelection (e) {
        if (this.state.dragging) {
            e.preventDefault();
            return false;
        }
    }

    mouseUpListener () {
        this.setState({ dragging: false, preview: this.toDataURL() });
    }

    mouseMoveListener (e) {
        if (!this.state.dragging) return;

        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const imageX = this.state.image.x;
        const imageY = this.state.image.y;

        const newImage = this.state.image;

        if (this.state.mouse.x && this.state.mouse.y) {
            let dx = this.state.mouse.x - mouseX;
            let dy = this.state.mouse.y - mouseY;

            let bounded = this.boundedCoords(imageX, imageY, dx, dy);

            newImage.x = bounded.x;
            newImage.y = bounded.y;
        }

        this.setState({
            image: this.state.image,
            mouse: {
                x: mouseX,
                y: mouseY
            }
        });
    }

    boundedCoords (x, y, dx, dy) {
        let newX = x - dx;
        let newY = y - dy;

        let scaledWidth = this.state.image.width * this.state.zoom;
        let dw = (scaledWidth - this.state.image.width) / 2;

        let rightEdge = this.props.width;

        if (newX - dw > 0) { x = dw; }
        else if (newX < (-scaledWidth + rightEdge)) { x = rightEdge - scaledWidth; }
        else {
            x = newX;
        }

        let scaledHeight = this.state.image.height * this.state.zoom;
        let dh = (scaledHeight - this.state.image.height) / 2;

        let bottomEdge = this.props.height;
        if (newY - dh > 0) { y = dh; }
        else if (newY < (-scaledHeight + bottomEdge)) { y = bottomEdge - scaledHeight; }
        else {
            y = newY;
        }

        return { x: x, y: y };
    }

    componentDidMount () {
        this.props.onRef(this);
        let canvas = ReactDom.findDOMNode(this.refs.canvas);
        this.prepareImage(this.props.image);

        this.listeners = {
            mousemove: e => this.mouseMoveListener(e),
            mouseup: e => this.mouseUpListener(e),
            mousedown: e => this.mouseDownListener(e)
        };

        window.addEventListener("touchstart", this.listeners.mouseup, false);
        window.addEventListener("touchmove", this.listeners.mousemove, false);
        canvas.addEventListener("touchend", this.listeners.mousedown, false);
        window.addEventListener("mousemove", this.listeners.mousemove, false);
        window.addEventListener("mouseup", this.listeners.mouseup, false);
        canvas.addEventListener("mousedown", this.listeners.mousedown, false);
        document.onselectstart = e => this.preventSelection(e);
    }

    // make sure we clean up listeners when unmounted.
    componentWillUnmount () {
        this.props.onRef(undefined);
        let canvas = ReactDom.findDOMNode(this.refs.canvas);
        window.removeEventListener("mousemove", this.listeners.mousemove);
        window.removeEventListener("mouseup", this.listeners.mouseup);
        canvas.removeEventListener("mousedown", this.listeners.mousedown);
    }

    componentDidUpdate () {
        let context = ReactDom.findDOMNode(this.refs.canvas).getContext("2d");
        context.clearRect(0, 0, this.props.width, this.props.height);
        this.addImageToCanvas(context, this.state.image);
    }

    addImageToCanvas (context, image) {
        if (!image.resource) return;
        context.save();
        context.globalCompositeOperation = "destination-over";
        let scaledWidth = this.state.image.width * this.state.zoom;
        let scaledHeight = this.state.image.height * this.state.zoom;

        let x = image.x - (scaledWidth - this.state.image.width) / 2;
        let y = image.y - (scaledHeight - this.state.image.height) / 2;

        // need to make sure we aren't going out of bounds here...
        x = Math.min(x, 0);
        y = Math.min(y, 0);
        y = scaledHeight + y >= this.props.height ? y : (y + (this.props.height - (scaledHeight + y)));
        x = scaledWidth + x >= this.props.width ? x : (x + (this.props.width - (scaledWidth + x)));

        context.drawImage( image.resource, x, y, image.width * this.state.zoom, image.height * this.state.zoom);
        context.restore();
    }

    toDataURL () {
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");

        canvas.width = this.props.width;
        canvas.height = this.props.height;

        this.addImageToCanvas(context, {
            resource: this.state.image.resource,
            x: this.state.image.x,
            y: this.state.image.y,
            height: this.state.image.height,
            width: this.state.image.width
        });

        return canvas.toDataURL();
    }

    handleCrop () {
        let data = this.toDataURL();
        this.props.onCrop(data);
    }

    handleZoomUpdate (event, newValue) {
        event.preventDefault();
        this.setState({zoom: newValue});
    }

    render () {
        return (
            <div className="AvatarCropper-canvas">
                <Row>
                    <canvas
                        ref="canvas"
                        style={{"borderRadius": "50%"}}
                        width={this.props.width}
                        height={this.props.height}>
                    </canvas>
                </Row>

                <Row>
                    <Slider
                        name="zoom"
                        ref="zoom"
                        onChange={this.handleZoomUpdate.bind(this)}
                        style={{width: this.props.width}}
                        min={1}
                        max={3}
                        step={0.01}
                        defaultValue={1}
                    />
                </Row>
            </div>
        );
    }
}
Cropper.propTypes = {
    image: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    zoom: React.PropTypes.number,
    onRef: React.PropTypes.func.isRequired
};
Cropper.defaultProps = { width: 400, height: 400, zoom: 1 };

export class AvatarCropper extends BaseComponent {
    constructor () {
        super();
    }

    render () {
        const actions = [
            <FlatButton
                label={this.props.closeButtonCopy}
                primary={false}
                onClick={this.props.onRequestHide}
            />,
            <FlatButton
                label={this.props.cropButtonCopy}
                primary={true}
                keyboardFocused={true}
                onClick={()=>{this.child.handleCrop()}}
            />,
        ];
        return (
            <Dialog
                title="Обрезать"
                onHide={this.props.onRequestHide}
                open={this.props.cropperOpen}
                autoScrollBodyContent={true}
                actions={actions}
                modal={false}>
                <div className="AvatarCropper-base">
                    <Cropper
                        onRef={ref => (this.child = ref)}
                        image={this.props.image}
                        width={this.props.width}
                        height={this.props.height}
                        onCrop={this.props.onCrop}
                        onRequestHide={this.props.onRequestHide}
                    />
                </div>
            </Dialog>
        );
    }
}

// The AvatarCropper Prop API
AvatarCropper.propTypes = {
    image: React.PropTypes.string.isRequired,
    onCrop: React.PropTypes.func.isRequired,
    closeButtonCopy: React.PropTypes.string,
    cropButtonCopy: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    onRequestHide: React.PropTypes.func.isRequired
};
AvatarCropper.defaultProps = { width: 400, height: 400, modalSize: "large",
    closeButtonCopy: "Закрыть", cropButtonCopy: "Обрезать и сохранить"};
