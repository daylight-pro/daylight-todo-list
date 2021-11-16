import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ThemeProvider} from '@mui/material/styles'
import {theme} from './materialui/theme'
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
	<SnackbarProvider>
	<ThemeProvider theme={theme}>
		<CssBaseline/>
		<App />
	</ThemeProvider>
	</SnackbarProvider>
	,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
