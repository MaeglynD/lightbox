import { Component } from 'react';
import ImageGallery from 'react-image-gallery';
import axios from 'axios';
import './App.scss';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			thumbnails_loaded: false,
			display_loaded: false,
		};
	}

	async componentDidMount() {
		await axios.get('https://run.mocky.io/v3/525464b2-740b-40f8-9fb4-1cf0a6be1a6d')
			.then(({ data }) => {
				// Format the data before setting state
				data = data.map((x) => ({
					...x,
					original: x.fileurl,
					thumbnail: x.thumbnailurl,
					name: (x.name.replace('-', ' ')).slice(0, -4),
					metadata: {
						'Type': `${x.mimetype.split()[1]}`,
						'Resolution': `${x.height} x ${x.width})`,
						'Aspect ratio': `${x.aspectratio.toFixed(2)} (${x.aspectratiocalculated})`,
						'Size': 'Unknown',
					},
				}));

				// Update the state
				this.setState({ data });
			})
			.catch(({ err }) => {
				console.log(err);
			});
	}

	_omitItem = (item) => {
		this.setState((prev) => ({
			data: prev.data.filter((x) => x.thumbnailurl !== item.target.src),
		}));
	}

	_renderItem(item) {
		return (
			<div className="l-display-container">
				<div className="l-display-overflow">
					<img
						src={item.original}
						alt="name"
						className="l-display-image"
					/>
					<img
						src={item.original}
						alt="name"
						className="l-display-underlap"
					/>
				</div>
			</div>
		);
	}

	render() {
		const {
			data,
		} = this.state;

		return (
			<div className="l-app">
				{/* Image & image selection container */}
				<div className="l-portion-a">
					<ImageGallery
						items={data}
						lazyLoad
						showNav={false}
						showFullscreenButton={false}
						useBrowserFullscreen={false}
						showPlayButton={false}
						renderItem={this._renderItem}
						slideDuration={0}
						onThumbnailError={this._omitItem}
					/>
				</div>
				{/* Info container */}
				<div className="l-portion-b">
					{/*  */}
				</div>
			</div>
		);
	}
}

export default App;
