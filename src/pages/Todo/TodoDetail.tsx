import React from 'react';
import {List,ListItem,ListItemText,Checkbox, Typography,Box,Collapse,ListItemIcon,LinearProgress} from '@mui/material'
import { makeStyles } from '@mui/styles';
import marked from 'marked';
import {Todo} from '../../types/type'

const useStyles = makeStyles((theme)=> ({
	note:{
		lineHeight:2.5
	},
	nested: {
  	  //paddingLeft: theme.spacing(4),
  	},
	expandButton:{
		border: "solid",
		borderRadius:"50%",
		fontSize:"30px"
	},
	button:{
		padding:"0"
	},
	md:{
		textAlign: "left",
		paddingLeft: "4px !important"
	}
}));


type LinearProgressWithLabelPropsType = {
	value:number
}

function LinearProgressWithLabel(props:LinearProgressWithLabelPropsType) {
  return (
    <Box width="95%" ml={1}>
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

type DetailPropsType = {
	todo : Todo,
	isOpen : boolean,
	onSubChange: ((todo:Todo, title:string, index:number)=> void)
}


function TodoDetail(props:DetailPropsType){
	const classes = useStyles();
	const handleSubChange = (title:string, index:number) =>{
		props.onSubChange(props.todo,title,index)
	}
	const getProgress = ()=>{
		const todo = props.todo
		if(todo.subTasks.length === 0)return 0;
		let cntCompleted = 0;
		todo.subTasks.forEach((sub)=>{
			if(sub.completed){
				cntCompleted++;
			}
		})
		return cntCompleted/todo.subTasks.length*100;
	}
	return(
		<Collapse sx={{ml:5}} in={props.isOpen} timeout="auto" unmountOnExit>
			{(props.todo.note !== "") &&
				<span className={classes.md} dangerouslySetInnerHTML={{ __html: marked(props.todo.note)}}/>
			}
			{props.todo.subTasks.length !== 0 &&
				<List component="div" disablePadding>
				<ListItem key={props.todo.title+"-progressBar"} className={classes.nested} >
					<LinearProgressWithLabel value={getProgress()} />
				</ListItem>
				{props.todo.subTasks.map((sub,index)=>{
					return(
					<ListItem button className={classes.nested} key={sub.title+"-"+index}>
						<ListItemIcon>
						<Checkbox
							checked={sub.completed}
							inputProps={{'aria-label':'primary checkbox'}}
							onChange={()=>{handleSubChange(sub.title,index)}}
							onClick={(e)=>{
								e.stopPropagation();
							}}
						/>
						</ListItemIcon>
						<ListItemText primary={sub.completed?
								<Typography
									style={{textDecoration: "line-through"}}
								>
									{sub.title}
								</Typography>
								:
								<Typography
								>
									{sub.title}
								</Typography>
							} />
					</ListItem>
					)
				})}
				</List>
			}
			</Collapse>
	);
}

export default TodoDetail;