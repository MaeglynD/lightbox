import {
	Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import { Component } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import ImageGallery from 'react-image-gallery';
import axios from 'axios';
import './App.scss';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			thumbnailsLoading: true,
			displayLoading: true,
			drawerActive: true,
			currentIndex: 0,
		};
	}

	async componentDidMount() {
		await axios.get('https://run.mocky.io/v3/525464b2-740b-40f8-9fb4-1cf0a6be1a6d')
			.then(({ data }) => {
				// Format the data before setting state
				data = data.map((x) => ({
					original: x.fileurl,
					thumbnail: x.thumbnailurl,
					name: (x.name.replace('-', ' ')).slice(0, -4),
					tags: x.metadata ? x.metadata.split(',') : [],
					metadata: {
						'Type': `${x.mimetype.split('/')[1]}`,
						'Resolution': `${x.height} × ${x.width}`,
						'Aspect ratio': `${x.aspectratio.toFixed(2)} (${x.aspectratiocalculated})`,
						'Size': 'Unknown',
					},
				}));

				// Update the state
				this.setState({ data });
			})
			.catch((err) => {});
	}

	// Omit an item if corrupted image
	_omitItem = (item) => {
		this.setState((prev) => ({
			data: prev.data.filter((x) => x.thumbnail !== item.target.src),
		}));
	}

	// Renders the display image
	_renderItem = (item) => {
		const { displayLoading } = this.state;

		return (
			<div className="l-display-container">
				<div className="l-display-overflow">
					{displayLoading && (<Skeleton />)}
					<img
						src={item.original}
						alt="name"
						className="l-display-image"
					/>
					<img
						src={item.original}
						alt="name"
						className="l-display-underlap"
						onLoad={() => this.setState({ displayLoading: false, thumbnailsLoading: false })}
					/>
				</div>
			</div>
		);
	}

	_renderThumb = (item) => {
		const { thumbnailsLoading } = this.state;

		return (
			<div className="image-gallery-thumbnail-inner">
				{thumbnailsLoading && <Skeleton />}
				<img
					className="image-gallery-thumbnail-image"
					src={item.thumbnail}
					alt={item.name}
					onError={this._omitItem}
				/>
			</div>
		);
	}

	render() {
		const {
			data,
			displayLoading,
			thumbnailsLoading,
			currentIndex,
			drawerActive,
		} = this.state;

		return (
			<SkeletonTheme
				color="#242424"
				highlightColor="rgba(255, 255, 255, 0.02)"
			>
				<div
					className={`l-app 
						${displayLoading ? 'l-loading' : ''} 
						${thumbnailsLoading ? 'l-t-loading' : ''}
						${drawerActive ? 'l-active' : ''}`}
				>
					{/* Image & image selection container */}
					<div className="l-portion-a">
						<div
							className="l-info-button"
							onClick={() => this.setState({ drawerActive: true })}
						>
							<svg viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M16.5,12C19,12 21,14 21,16.5C21,
									17.38 20.75,18.21 20.31,18.9L23.39,
									22L22,23.39L18.88,20.32C18.19,
									20.75 17.37,21 16.5,21C14,
									21 12,19 12,16.5C12,14 14,
									12 16.5,12M16.5,14A2.5,2.5 0 0,
									0 14,16.5A2.5,2.5 0 0,0 16.5,19A2.5,
									2.5 0 0,0 19,16.5A2.5,2.5 0 0,0 16.5,
									14M9,4L11,6H19A2,2 0 0,1 21,8V11.81C19.83,
									10.69 18.25,10 16.5,10A6.5,6.5 0 0,
									0 10,16.5C10,17.79 10.37,19 11,20H3C1.89,
									20 1,19.1 1,18V6C1,4.89 1.89,4 3,4H9Z" />
							</svg>
						</div>
						<ImageGallery
							items={data}
							lazyLoad
							showNav={false}
							showFullscreenButton={false}
							useBrowserFullscreen={false}
							onSlide={(currentIndex) => this.setState({ currentIndex })}
							showPlayButton={false}
							renderItem={this._renderItem}
							renderThumbInner={this._renderThumb}
							slideDuration={0}
							useTranslate3D={false}
						/>
					</div>
					{/* Info container */}
					<div className="l-portion-b">
						<div
							className="l-overlay"
							onClick={() => this.setState({ drawerActive: false })}
						/>
						<Tabs className="l-tab-container">
							<TabList className="l-tab-list">
								<Tab className="l-tab">Info</Tab>
								<Tab className="l-tab">Google vision</Tab>
							</TabList>

							<TabPanel className="l-panel">
								{displayLoading ? (
									<>
										<Skeleton width={50} height={20} />
										<Skeleton height={50} />
										<Skeleton width={50} height={20} />
										<Skeleton height={50} />
									</>
								) : (
									<>
										<div className="l-panel-sub">Name</div>
										<div className="l-panel-input">
											{data[currentIndex].name}
										</div>
										<div className="l-panel-sub">Tags</div>
										<div className="l-panel-input l-tags">
											{data[currentIndex].tags.map((x) => (
												<div
													className="l-panel-tag"
													key={x}
												>
													{x}
												</div>
											))}
										</div>
										<div className="l-panel-sub">Metadata</div>
										{Object.entries(data[currentIndex].metadata).map((x) => (
											<div
												className="l-panel-meta"
												key={x}
											>
												<div>{x[0]}</div>
												<div>{x[1]}</div>
											</div>
										))}
									</>
								)}
								<div className="l-extras-container">
									<a
										className="l-extras-btn"
										href={`http://images.google.com/searchbyimage?image_url=${data.length ? data[currentIndex].original : ''}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<svg viewBox="0 0 24 24">
											<path
												fill="currentColor"
												d="M21.35,11.1H12.18V13.83H18.69C18.36,
												17.64 15.19,19.27 12.19,19.27C8.36,
												19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,
												4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,
												4.72C19,4.72 16.56,2 12.1,2C6.42,
												2 2.03,6.8 2.03,12C2.03,17.05 6.16,
												22 12.25,22C17.6,22 21.5,18.33 21.5,
												12.91C21.5,11.76 21.35,11.1 21.35,
												11.1V11.1Z" />
										</svg>
									</a>
								</div>
							</TabPanel>
							<TabPanel className="l-panel">
								Coming soon...
							</TabPanel>
							{!displayLoading && (
								<div className="l-download-container">
									<a
										className="l-download-button"
										target="_blank"
										rel="noopener noreferrer"
										download
										href={data[currentIndex].original}
									>
										download
									</a>
								</div>
							)}
						</Tabs>
					</div>
				</div>
			</SkeletonTheme>
		);
	}
}

export default App;
