import React from 'react';
import {Box} from '@mui/material'
import { makeStyles } from '@mui/styles';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RepeatIcon from '@mui/icons-material/Repeat'
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

type DueViewerPropsType = {
	due : Date,
	repeat?: boolean | undefined,
}

function DueViewer(props: DueViewerPropsType){
	const classes = useStyles();
	return(
	<React.Fragment>
		{(props.due.getTime()-new Date().getTime()) <= 0 ?
			<Box component="span" mt={1}>
				<Box component="span" className={classes.todoIcon + " " + classes.over} display="inline" >
					{props.repeat?<RepeatIcon/>:<HourglassEmptyIcon/>}
				</Box>
			<Box component="span" ml={1} display="inline" className={classes.over}>
				{Math.floor(-(props.due.getTime()-new Date().getTime())/1000/60/60) < 24 ?
					"Over " + Math.floor(-(props.due.getTime()-new Date().getTime())/1000/60/60)+" Hours"
				:
					"Over " + Math.floor(-(props.due.getTime()-new Date().getTime())/1000/60/60/24)+" Days"
				}
				{"  "}[{Util.printDue(props.due)}]
			</Box>
			</Box>
			:(Math.floor((props.due.getTime()-new Date().getTime())/1000/60/60))< 24 ?
				<Box component="span" mt={1}>
				<Box component="span" className={classes.todoIcon + " " + classes.soonDeadLine} display="inline" >
					{props.repeat?<RepeatIcon/>:<HourglassEmptyIcon/>}
				</Box>
				<Box component="span" ml={1} display="inline" className={classes.soonDeadLine}>
					{Math.floor((props.due.getTime()-new Date().getTime())/1000/60/60)+" Hours"}
					{"  "}[{Util.printDue(props.due)}]
				</Box>
				</Box>
				:
				<Box component="span" mt={1}>
					<Box component="span" className={classes.todoIcon} display="inline" >
						{props.repeat?<RepeatIcon/>:<HourglassEmptyIcon/>}
					</Box>
					<Box component="span" ml={1} display="inline">
						{Math.floor((props.due.getTime()-new Date().getTime())/1000/60/60/24)+" Days"}
						{"  "}[{Util.printDue(props.due)}]
					</Box>
					</Box>
		}
	</React.Fragment>
	);
}

export default DueViewer;