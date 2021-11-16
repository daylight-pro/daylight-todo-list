import React from 'react';
import {List,ListItem,Divider,ListItemText,ListItemAvatar,Checkbox, Typography,Box,IconButton} from '@mui/material'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { makeStyles } from '@mui/styles';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Todo} from '../../types/type'
import TodoDetail from './TodoDetail'
import Util from '../../Util'

const useStyles = makeStyles((theme)=> ({
	todoIcon:{
		verticalAlign:"-6px"
	},
	soonDeadLine:{
		color:"#FFB83F"
	},
	titleIcon:{
		verticalAlign:"-4px",
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
  	  //paddingLeft: theme.spacing(4),
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

type AllTodoPropsType = {
	todoList : Todo[],
	changeCompleted : (todo:Todo, hidden?:boolean)=>void
	todoClicked: React.Dispatch<React.SetStateAction<Todo | null>>
	isOpenSubtasks: { [key: string]: boolean; },
	setIsOpenSubtasks:React.Dispatch<React.SetStateAction<{
		[key: string]: boolean;
	}>>,
	edit: (todo: Todo, hidden?: boolean) => void, 
}


function AllTodo(props:AllTodoPropsType){
	const todoList = props.todoList;
	todoList.sort((a:Todo,b:Todo)=>{
		return a.due.getTime() - b.due.getTime();
	});
	const changed = props.changeCompleted;
	const classes = useStyles();

	const handleExpandMore = (e:React.MouseEvent<SVGSVGElement, MouseEvent>, todo:Todo)=>{
		e.stopPropagation();
		const newS =  Object.create(props.isOpenSubtasks);
		newS[todo.title] = true;
		props.setIsOpenSubtasks(newS);
	}
	const handleExpandLess = (e:React.MouseEvent<SVGSVGElement, MouseEvent>, todo:Todo)=>{
		e.stopPropagation();
		const newS = Object.create(props.isOpenSubtasks);
		newS[todo.title] = false;
		props.setIsOpenSubtasks(newS);
	}
	const handleSubChange = (todo:Todo, title:string, index:number) =>{
		todo.subTasks[index] = {
			title: title,
			completed: !todo.subTasks[index].completed
		};
		props.edit(todo,true);
	}
	return(
	<React.Fragment>
		<Box  mt={4} mb={2}>
		<Typography variant="h4">
			<ListAltIcon className={classes.titleIcon} fontSize='large'/> 全て
		</Typography>
		</Box>
		<List>
			{/*受け取ったtodoListを使って表示する*/}
			{todoList.map((todo:Todo, idx:number) => (
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
										<Box component="span" mt={1} mr={3}>
										<Box component="span" className={classes.todoIcon+ " " +(Math.floor((todo.start.getTime()-new Date().getTime())/1000/60/60) < 0 ?classes.working:"")} display="inline">
											<PlayCircleFilledIcon/>
										</Box>
										<Box component="span" ml={1} display="inline" className={(Math.floor((todo.start.getTime()-new Date().getTime())/1000/60/60) < 0 ?classes.working:"")}>
										{Math.floor((todo.start.getTime()- new Date().getTime())/1000/60/60) < 0 ?
											"Working"
										:
											 Math.ceil((todo.start.getTime()-((new Date().getTime())))/1000/60/60/24)+" Days"
										}
										{"  "}[{Util.printStart(todo.start)}]
										</Box>
										</Box>
									}
									<br className="br-sp"/>
								{(todo.due.getTime()-((new Date().getTime()))) <= 0 ?
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
			))}
	</List>
	</React.Fragment>
	);
}

export default AllTodo;