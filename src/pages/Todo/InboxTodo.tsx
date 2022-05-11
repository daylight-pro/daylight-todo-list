import React from 'react';
import {yellow,blue,green,orange,red} from '@mui/material/colors';
import {List,ListItem,Divider,ListItemText,ListItemAvatar,Checkbox, Typography,Box,IconButton} from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Todo} from '../../types/type'
import TodoDetail from './TodoDetail'
import Util from '../../Util'
import {DueViewer} from '../../components/dueViewer';
import myClasses from '../../materialui/myClasses';


type InboxTodoPropsType = {
	todoList : Todo[],
	changeCompleted : (todo:Todo, hidden?:boolean)=>void
	todoClicked: React.Dispatch<React.SetStateAction<Todo | null>>
	isOpenSubtasks: { [key: string]: boolean; },
	setIsOpenSubtasks:React.Dispatch<React.SetStateAction<{
		[key: string]: boolean;
	}>>,
	edit: (todo: Todo, hidden?: boolean) => void, 
}

function InboxTodo(props: InboxTodoPropsType){
	const todoList : Todo[] = [];
	const color_dict = {"red":red[500],"yellow":yellow[500],"orange":orange[500],"green":green[500],"blue":blue[500]};
	
	props.todoList.forEach((todo)=>{
		if(todo.start == null){
			todoList.push(todo);
		}
	});
	todoList.sort((a,b)=>{
		return a.due.getTime() - b.due.getTime();
	});
	const changed = props.changeCompleted;
	const classes = myClasses.useStyles();

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
	const handleSubChange = (todo : Todo, title : string, index : number) =>{
		todo.subTasks[index] = {
			title: title,
			completed: !todo.subTasks[index].completed
		}
		props.edit(todo,true);
	}
	return(
	<React.Fragment>
		<Box  mt={4} mb={2}>
		<Typography variant="h4" className={classes.inbox}>
			<InboxIcon className={classes.titleIcon} fontSize='large'/> インボックス
		</Typography>
		</Box>
		<List>
			{/*受け取ったtodoListを使って表示する*/}
			{todoList.map((todo) => (
				<React.Fragment>
				<ListItem button alignItems="flex-start" key={todo.id} onClick={() => {props.todoClicked(todo)}} >
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
							<DueViewer due={todo.due}/>
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

export default InboxTodo;