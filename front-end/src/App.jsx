import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/homePage';
import BookPage from './pages/bookPage';
import HeaderComp from './components/headerComp';
import './App.css';

function App() {

	// detect if user has system dark mode on
	let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

	// State that controls if 'dark-mode' class is added 
	const [darkmodeState, setDarkmodeState] = useState(dark);
	let darkmodeClass = darkmodeState ? "dark-mode" : "";

	function toggleDarkmodeState() {
		setDarkmodeState(prevstate => !prevstate);
	}

	// check radio button automatically if system dark mode is on
	useEffect(() => {
		if (darkmodeState) {
			document.querySelector('#darkmode-toggle-dark').checked = true;
		} else {
			document.querySelector('#darkmode-toggle-light').checked = true;
		}
	}, []);

	return (
		<BrowserRouter>
			<div className={`App ${darkmodeClass}`}>
				<header>
					<HeaderComp toggleDarkmodeState={toggleDarkmodeState} />
				</header>
				<main>
					<Routes>
						<Route path='/' element={<HomePage />} />
						<Route path='/book' element={<BookPage />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	)
}

export default App
