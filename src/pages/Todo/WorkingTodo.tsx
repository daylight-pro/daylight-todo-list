import React from 'react';
import {yellow,blue,green,orange,red} from '@mui/material/colors';
import {List,ListItem,Divider,ListItemText,ListItemAvatar,Checkbox, Typography,Box,IconButton} from '@mui/material'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Todo} from '../../types/type'
import TodoDetail from './TodoDetail'
import Util from '../../Util'
import {DueViewer} from '../../components/dueViewer';
import myClasses from '../../materialui/myClasses';


type WorkingTodoPropsType = {
	todoList : Todo[],
	changeCompleted : (todo: Todo, hidden?: boolean) => void,
	todoClicked : React.Dispatch<React.SetStateAction<Todo | null>>,
	isOpenSubtasks : {
		[key: string]: boolean;
	},
	setIsOpenSubtasks : React.Dispatch<React.SetStateAction<{
		[key: string]: boolean;
	}>>,
	edit : (todo: Todo, hidden?: boolean) => void
}

function WorkingTodo(props:WorkingTodoPropsType){
	const todoList : Todo[] = [];
	const color_dict = {"red":red[500],"yellow":yellow[500],"orange":orange[500],"green":green[500],"blue":blue[500]};
	const changed = props.changeCompleted;
	const classes = myClasses.useStyles();
	const handleExpandMore = (e:React.MouseEvent<SVGSVGElement, MouseEvent>, todo : Todo)=>{
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
	const handleSubChange = (todo:Todo, title:string, index:number) =>{
		todo.subTasks[index] = {
			title:title,
			completed: !todo.subTasks[index].completed
		}
		props.edit(todo,true);
	}
	props.todoList.forEach((todo)=>{
		if((todo.start != null)&&(todo.start.getTime()-new Date().getTime())/1000/60/60 < 0){
			todoList.push(todo);
		}
	});
	todoList.sort((a,b)=>{
		if(a.completed && !b.completed)return 1;
		else if(!a.completed && b.completed)return -1;
		return a.due.getTime() - b.due.getTime();
	});
	return(
	<React.Fragment>
		<Box  mt={4} mb={2}>
		<Typography variant="h4" className={classes.working}>
			<PlayCircleFilledIcon fontSize='large' className={classes.titleIcon}/> 実行中
		</Typography>
		</Box>
		<List>
			{/*受け取ったtodoListを使って表示する*/}
			{todoList.map((todo) => (
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
								sx={{color:color_dict[todo.color]}}
							>
								{todo.title}
							</Typography>
						}
						secondary={
							<React.Fragment>
								<DueViewer due={todo.due}/>
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

export default WorkingTodo;