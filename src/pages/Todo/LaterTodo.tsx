import React from 'react';
import {List,ListItem,Divider,ListItemText,ListItemAvatar,Checkbox, Typography,Box,IconButton} from '@mui/material'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { makeStyles } from '@mui/styles';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EventIcon from '@mui/icons-material/Event';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Todo} from '../../types/type'
import TodoDetail from './TodoDetail'
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
	title:{
		color:"#dc143c"
	},
	labelTitle:{
		color: "#9B95C9"
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

type LaterTodoPropsType = {
	todoList : Todo[],
	changeCompleted : (todo:Todo, hidden?:boolean)=>void
	todoClicked: React.Dispatch<React.SetStateAction<Todo | null>>
	isOpenSubtasks: { [key: string]: boolean; },
	setIsOpenSubtasks:React.Dispatch<React.SetStateAction<{
		[key: string]: boolean;
	}>>,
	edit: (todo: Todo, hidden?: boolean) => void, 
}

function LaterTodo(props:LaterTodoPropsType){
	const todoList : Todo[] = [];
	const curTodoList : Todo[][] = [];
	for(let i = 0; i < 7;i++){
		curTodoList.push([]);
	}
	const laterTodoList : Todo[] = [];
	props.todoList.forEach((todo)=>{
		if(todo.start != null){
			const days = Math.floor((todo.start.getTime()-new Date().getTime())/1000/60/60/24);
			if(days>=0){
				if(days < 7){
					curTodoList[days].push(todo);
				}else{
					laterTodoList.push(todo);
				}
			}
		}
	});
	curTodoList.forEach((innerTodoList)=>{
		innerTodoList.sort((a,b)=>{
				return a.due.getTime() - b.due.getTime();
		});
	});
	laterTodoList.sort((a,b)=>{
		if(a.start!.getTime() === b.start!.getTime()) return a.due.getTime() - b.due.getTime();
		return a.start!.getTime() - b.start!.getTime();
	});
	curTodoList.forEach((innerTodoList,ind)=>{
		const date = new Date();
		date.setDate(date.getDate() + 1 + ind);
		todoList.push({title:""+(ind+1)+" Days Before ["+Util.printDate(date)+"]",start:new Date(),due:new Date(),id:"",completed:false,subTasks:[],note:"DayHeader"})
		innerTodoList.forEach((todo)=>{
				todoList.push(todo)
		});
	});
	todoList.push({title:"Later",start:new Date(),due:new Date(),id:"",completed:false,subTasks:[],note:"DayHeader"})
	laterTodoList.forEach((todo)=>{
		todoList.push(todo)
	});
	const changed = props.changeCompleted;
	const classes = useStyles();
	const handleExpandMore = (e:React.MouseEvent<SVGSVGElement, MouseEvent>, todo : Todo)=>{
		console.log(props.isOpenSubtasks);
		e.stopPropagation();
		const newS =  Object.create(props.isOpenSubtasks);
		newS[todo.title] = true;
		props.setIsOpenSubtasks(newS);
	}
	const handleExpandLess = (e:React.MouseEvent<SVGSVGElement, MouseEvent>, todo : Todo)=>{
		e.stopPropagation();
		const newS = Object.create(props.isOpenSubtasks);
		newS[todo.title] = false;
		props.setIsOpenSubtasks(newS);
	}
	const handleSubChange = (todo: Todo, title:string, index:number) =>{
		todo.subTasks[index] = {
			title: title,
			completed: !todo.subTasks[index].completed
		}
		props.edit(todo,true);
	}
	return(
	<React.Fragment>
		<Box  mt={4} mb={2}>
		<Typography variant="h4" className={classes.title}>
			<EventIcon className={classes.titleIcon} fontSize='large' sx={{mr:4}}/> 未着手
		</Typography>
		</Box>
		<List>
			{/*受け取ったtodoListを使って表示する*/}
			{todoList.map((todo) => (
				<React.Fragment>
					{todo.note === "DayHeader"?
						<React.Fragment>
							<ListItem key={todo.title}>
							<ListItemText
								primary={
								<Typography
										variant={"h6"}
										className={classes.labelTitle}
								>
									{todo.title}
								</Typography>
								}
							/>
							</ListItem>
							<Divider component="li"/>
						</React.Fragment>
					:
					<React.Fragment>
						<ListItem button alignItems="flex-start" key={todo.id} onClick={() => {props.todoClicked(todo)}}>
							<ListItemAvatar>
							<Checkbox 
								checked={todo.completed}
								inputProps={{'aria-label':'primary checkbox'}}
								onChange={(e)=>{
										changed(todo);
									}
								}
								onClick={(e)=>{
									e.stopPropagation();
								}}
							/>
							</ListItemAvatar>
							<ListItemText
								primary={todo.completed?
									<Typography
										variant={"h6"}
										style={{textDecoration: "line-through"}}
									>
										{todo.title}
									</Typography>
									:
									<Typography
										variant={"h6"}
									>
										{todo.title}
									</Typography>
								}
								secondary={
									<React.Fragment>
										<React.Fragment>
											{(todo.start != null) &&
												<Box component="span" mt={1} mr={4}>
												<Box component="span" className={classes.todoIcon+ " " +(Math.floor((todo.start.getTime()-new Date().getTime())/1000/60/60) < 0 ?classes.working:"")} display="inline">
													<PlayCircleFilledIcon/>
												</Box>
												<Box component="span" ml={1} display="inline" className={(Math.floor((todo.start.getTime()-new Date().getTime())/1000/60/60) < 0 ?classes.working:"")}>
												{Math.floor((todo.start.getTime()-new Date().getTime())/1000/60/60) < 0 ?
													"Working"
												:
													Math.ceil((todo.start.getTime()-new Date().getTime())/1000/60/60/24)+" Days"
												}
												{"  "}[{Util.printStart(todo.start)}]
												</Box>
												</Box>
											}
											<br className="br-sp"/>
										{(todo.due.getTime()-new Date().getTime()) <= 0 ?
											<Box component="span" mt={1}>
												<Box component="span" className={classes.todoIcon + " " + classes.over} display="inline" >
													<HourglassEmptyIcon/>
												</Box>
											<Box component="span" ml={1} display="inline" className={classes.over}>
												{Math.floor(-(todo.due.getTime()-new Date().getTime())/1000/60/60) < 24 ?
													"Over " + Math.floor(-(todo.due.getTime()-new Date().getTime())/1000/60/60)+" Hours"
												:
													"Over " + Math.floor(-(todo.due.getTime()-new Date().getTime())/1000/60/60/24)+" Days"
												}
												{"  "}[{Util.printDue(todo.due)}]
											</Box>
											</Box>
											:(Math.floor((todo.due.getTime()-new Date().getTime())/1000/60/60))< 24 ?
												<Box component="span" mt={1}>
												<Box component="span" className={classes.todoIcon + " " + classes.soonDeadLine} display="inline" >
													<HourglassEmptyIcon/>
												</Box>
												<Box component="span" ml={1} display="inline" className={classes.soonDeadLine}>
													{Math.floor((todo.due.getTime()-new Date().getTime())/1000/60/60)+" Hours"}
													{"  "}[{Util.printDue(todo.due)}]
												</Box>
												</Box>
												:
												<Box component="span" mt={1}>
													<Box component="span" className={classes.todoIcon} display="inline" >
														<HourglassEmptyIcon/>
													</Box>
													<Box component="span" ml={1} display="inline">
														{Math.floor((todo.due.getTime()-new Date().getTime())/1000/60/60/24)+" Days"}
														{"  "}[{Util.printDue(todo.due)}]
													</Box>
													</Box>
										}
										</React.Fragment>
									</React.Fragment>
								}
							/>
							<IconButton className={classes.button}>
					{Util.canOpenDetail(todo) && (Util.isOpenDetail(todo,props.isOpenSubtasks)?<ExpandLess className={classes.expandButton} onClick={(e)=>handleExpandLess(e,todo)}/>:<ExpandMore className={classes.expandButton} onClick={(e)=>handleExpandMore(e,todo)}/> )}
					</IconButton>
						</ListItem>
						<TodoDetail todo={todo} isOpen={Util.isOpenDetail(todo,props.isOpenSubtasks)} onSubChange={handleSubChange}/>
						<Divider component="li"/>
					</React.Fragment>
					}
				</React.Fragment>
			))}
	</List>
	</React.Fragment>
	);
}

export default LaterTodo;