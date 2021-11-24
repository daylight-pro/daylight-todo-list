import React from 'react';
import {Box,Typography} from '@mui/material';
import {Todo} from '../types/type';
import myClasses from '../materialui/myClasses';
import TodoView from './TodoView';
import { Droppable } from 'react-beautiful-dnd';

type WorkingColumnPropsType = {
	todoList : Todo[]
}

function WorkingColumn(props : WorkingColumnPropsType) {

	const classes = myClasses.useStyles();
	return(
		<Box className={classes.todoContainer}>
			<Typography variant="h4" className={classes.working+ " " + classes.columnTitle}>
					Working
			</Typography>
			<Droppable
				droppableId={"working"}
			>
				{(provided)=>(
					<Box
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={classes.taskList}
					>
						{props.todoList.filter(todo=>!todo.completed && todo.start && todo.start < new Date()).sort((a,b)=>{return a.due.getTime() -  b.due.getTime();}).map((todo,index)=>(
							<TodoView todo={todo} key={todo.id} index={index}/>
						))}
						{provided.placeholder}
					</Box>
				)}
			</Droppable>

		</Box>
	);
}

export default WorkingColumn;