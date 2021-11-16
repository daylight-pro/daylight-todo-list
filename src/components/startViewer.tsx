import React from 'react';
import {Box} from '@mui/material'
import { makeStyles } from '@mui/styles';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import Util from '../Util';

const useStyles = makeStyles((theme)=>({
	todoIcon:{
		verticalAlign:"-6px"
	},
	soonDeadLine:{
		color:"#FFB83F"
	},
	titleIcon:{
		verticalAlign:"-6px"
	},
	title:{
		color:"#8A77B7"	
	},
	over:{
		color:"#FF4CB1"
	},
	working:{
		color:"#7bc890"
	},
	note:{
		lineHeight:2.5
	},
	nested: {
  	  paddingLeft: 4,
  	},
	expandButton:{
		border: "solid",
		borderRadius:"50%",
		fontSize:"30px"
	},
	button:{
		padding:"0"
	}
}));

type StartViewerPropsType = {
	start : Date | null
}

function StartViewer(props: StartViewerPropsType){
	const classes = useStyles();
	return(
	<React.Fragment>
		{(props.start != null) &&
			<Box component="span" mt={1} mr={3}>
			<Box component="span" className={classes.todoIcon+ " " +(Math.floor((props.start.getTime()-new Date().getTime())/1000/60/60) < 0 ?classes.working:"")} display="inline">
				<PlayCircleFilledIcon/>
			</Box>
			<Box component="span" ml={1} display="inline" className={(Math.floor((props.start.getTime()-new Date().getTime())/1000/60/60) < 0 ?classes.working:"")}>
			{Math.floor((props.start.getTime()- new Date().getTime())/1000/60/60) < 0 ?
				"Working"
			:
					Math.ceil((props.start.getTime()-((new Date().getTime())))/1000/60/60/24)+" Days"
			}
			{"  "}[{Util.printStart(props.start)}]
			</Box>
			</Box>
		}
	</React.Fragment>
	);
}

export default StartViewer;