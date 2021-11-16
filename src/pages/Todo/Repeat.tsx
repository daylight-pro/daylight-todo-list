import React from 'react';
import {List,ListItem,Divider,ListItemText, Typography,Box,Checkbox,Collapse,ListItemIcon,IconButton} from '@mui/material'
import { makeStyles } from '@mui/styles';
import RepeatIcon from '@mui/icons-material/Repeat';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import marked from 'marked';
import {RepeatTodo} from '../../types/type'
import Util from '../../Util'

const useStyles = makeStyles((theme)=>({
	todoIcon:{
		verticalAlign:"-6px"
	},
	soonDeadLine:{
		color:"#FFB83F"
	},
	titleIcon:{
		verticalAlign:"-4px"
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
	title:{
		color:"#ffff61"
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

type RepeatPropsType = {
	repeatList: RepeatTodo[],
	repeatClicked: React.Dispatch<React.SetStateAction<RepeatTodo | null>>,
	isOpenSubtasks:{
		[key: string]: boolean;
	},
	setIsOpenSubtasks: React.Dispatch<React.SetStateAction<{
		[key: string]: boolean;
	}>>,
	edit:(repeat: RepeatTodo, hidden?: boolean) => void
}

function Repeat(props: RepeatPropsType){
	const repeatList = props.repeatList;
	repeatList.sort((a,b)=>{
		return a.due.getTime() - b.due.getTime();
	});
	const classes = useStyles();
	const handleExpandMore = (e:React.MouseEvent<SVGSVGElement, MouseEvent>, todo:RepeatTodo)=>{
		console.log(props.isOpenSubtasks);
		e.stopPropagation();
		const newS =  Object.create(props.isOpenSubtasks);
		newS[todo.title] = true;
		props.setIsOpenSubtasks(newS);
	}
	const handleExpandLess = (e:React.MouseEvent<SVGSVGElement, MouseEvent>, todo:RepeatTodo)=>{
		e.stopPropagation();
		const newS = Object.create(props.isOpenSubtasks);
		newS[todo.title] = false;
		props.setIsOpenSubtasks(newS);
	}
	const handleSubChange = (todo:RepeatTodo, title:string) =>{
		todo.subTasks.forEach((sub=>{
			if(sub.title === title){
				sub.completed = !sub.completed;
			}
		}));
		props.edit(todo,true);
	}
	return(
	<React.Fragment>
		<Box  mt={4} mb={2} className={classes.title}>
		<Typography variant="h4">
			<RepeatIcon className={classes.titleIcon} fontSize='large' sx={{mr:4}}/> 繰り返し
		</Typography>
		</Box>
		<List>
			{/*受け取ったtodoListを使って表示する*/}
			{repeatList.map((repeat, idx) => (
				<React.Fragment>
				<ListItem button alignItems="flex-start" key={repeat.id} onClick={() => {props.repeatClicked(repeat)}}>
					<ListItemText
						primary={<Typography
								variant={"h6"}
							>
								{repeat.title}
							</Typography>
						}
						secondary={
							<React.Fragment>
								<React.Fragment>
									{(repeat.note !== "") &&
										<Box className={classes.note} component="span" onClick={(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{e.stopPropagation()}}>
											<span dangerouslySetInnerHTML={{ __html: marked(repeat.note)}}/>
										</Box >
									}
								{(repeat.due.getTime()-new Date().getTime()) <= 0 ?
									<Box component="span" mt={1}>
										<Box component="span" className={classes.todoIcon + " " + classes.over} display="inline" >
											<RepeatIcon/>
										</Box>
									<Box component="span" ml={1} display="inline" className={classes.over}>
										{Math.floor(-(repeat.due.getTime()-new Date().getTime())/1000/60/60) < 24 ?
											"Over " + Math.floor(-(repeat.due.getTime()-new Date().getTime())/1000/60/60)+" Hours"
										:
											"Over " + Math.floor(-(repeat.due.getTime()-new Date().getTime())/1000/60/60/24)+" Days"
										}
										{"  "}[{Util.printDue(repeat.due)}]
									</Box>
									</Box>
									:(Math.floor((repeat.due.getTime()-new Date().getTime())/1000/60/60))< 24 ?
										<Box component="span" mt={1}>
										<Box component="span" className={classes.todoIcon + " " + classes.soonDeadLine} display="inline" >
											<RepeatIcon/>
										</Box>
										<Box component="span" ml={1} display="inline" className={classes.soonDeadLine}>
											{Math.floor((repeat.due.getTime()-new Date().getTime())/1000/60/60)+" Hours"}
											{"  "}[{Util.printDue(repeat.due)}]
										</Box>
										</Box>
										:
										<Box component="span" mt={1}>
											<Box component="span" className={classes.todoIcon} display="inline" >
												<RepeatIcon/>
											</Box>
											<Box component="span" ml={1} display="inline">
												{Math.floor((repeat.due.getTime()-new Date().getTime())/1000/60/60/24)+" Days"}
												{"  "}[{Util.printDue(repeat.due)}]
											</Box>
											</Box>
								}
								</React.Fragment>
							</React.Fragment>
						}
					/>
					<IconButton className={classes.button}>
					{Util.canOpenDetail(repeat)&&(Util.isOpenDetail(repeat,props.isOpenSubtasks)?<ExpandLess className={classes.expandButton} onClick={(e)=>handleExpandLess(e,repeat)}/>:<ExpandMore className={classes.expandButton} onClick={(e)=>handleExpandMore(e,repeat)}/> )}
					</IconButton>
					</ListItem><Collapse in={props.isOpenSubtasks[repeat.title] === true} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{repeat.subTasks.map((sub)=>{
							return(
							<ListItem button className={classes.nested} key={sub.title}>
								<ListItemIcon>
								<Checkbox
									checked={sub.completed}
									inputProps={{'aria-label':'primary checkbox'}}
									onChange={()=>{handleSubChange(repeat,sub.title)}}
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
					</Collapse>
				
				<Divider component="li"/>
				</React.Fragment>
			))}
	</List>
	</React.Fragment>
	);
}

export default Repeat;