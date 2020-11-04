import { Component } from 'react';
import {
	CarouselProvider, Slider, Slide,
} from 'pure-react-carousel';
import './App.scss';

class App extends Component {
	render() {
		return (
			<div className="l-app">
				{/* Image & image selection container */}
				<div className="l-portion-a">
					<CarouselProvider
						naturalSlideWidth={100}
						naturalSlideHeight={125}
						totalSlides={3}
					>
						<Slider>
							<Slide index={0}>I am the first Slide.</Slide>
							<Slide index={1}>I am the second Slide.</Slide>
							<Slide index={2}>I am the third Slide.</Slide>
						</Slider>
					</CarouselProvider>
					<div className="l-slides">
						{/*  */}
					</div>
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
