import React from 'react';
import {Box,Typography} from '@mui/material';
import {Todo} from '../types/type';
import myClasses from '../materialui/myClasses';
import TodoView from './TodoView';
import { Droppable } from 'react-beautiful-dnd';
import {useWindowSize} from 'react-use';
import Util from '../Util';

type LaterColumnPropsType = {
	todoList : Todo[],
}

function LaterColumn(props : LaterColumnPropsType) {
	const classes = myClasses.useStyles();
	const { width, height } = useWindowSize();
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
		todoList.push({title:Util.printDate(date),start:new Date(),due:new Date(),id:"",completed:false,subTasks:[],note:"DayHeader",color:"red"})
		innerTodoList.forEach((todo)=>{
				todoList.push(todo)
		});
	});
	todoList.push({title:"Later",start:new Date(),due:new Date(),id:"",completed:false,subTasks:[],note:"DayHeader",color:"red"})
	laterTodoList.forEach((todo)=>{
		todoList.push(todo)
	});
	return(
		<Box className={classes.todoContainer} sx={{flexGrow:1, height:height-180}}>
			<Typography variant="h4" className={classes.later+ " " + classes.columnTitle}>
					Later
			</Typography>
			<Droppable
				droppableId={"later"}
			>
				{(provided)=>(
					<Box
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={classes.taskList}
					>
						{todoList.filter(todo=>!todo.completed).map((todo,index)=>(
							<TodoView todo={todo} key={todo.id} index={index}/>
						))}
						{provided.placeholder}
					</Box>
				)}
			</Droppable>

		</Box>
	);
}

export default LaterColumn;