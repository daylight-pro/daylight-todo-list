import React from 'react';
import {Box,Typography} from '@mui/material';
import {Todo} from '../types/type';
import myClasses from '../materialui/myClasses';
import TodoView from './TodoView';
import { Droppable } from 'react-beautiful-dnd';
import {useWindowSize} from 'react-use';
type CompletedColumnPropsType = {
	todoList : Todo[]
}

function CompletedColumn(props : CompletedColumnPropsType) {

	const classes = myClasses.useStyles();
	
	const { height } = useWindowSize();
	return(
		<Box className={classes.todoContainer} sx={{height:height-320}}>
			<Typography variant="h4" className={classes.columnTitle + " " + classes.completed}>
					Completed
			</Typography>
			<Droppable
				droppableId={"completed"}
			>
				{(provided)=>(
					<Box
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={classes.taskList}
					>
						{props.todoList.filter(todo=>todo.completed).sort((a,b)=>{return a.due.getTime() -  b.due.getTime();}).map((todo,index)=>(
							<TodoView todo={todo} key={todo.id} index={index}/>
						))}
						{provided.placeholder}
					</Box>
				)}
			</Droppable>

		</Box>
	);
}

export default CompletedColumn;