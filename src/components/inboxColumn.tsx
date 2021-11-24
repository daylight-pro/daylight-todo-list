import React from 'react';
import {Box,Typography} from '@mui/material';
import {Todo} from '../types/type';
import myClasses from '../materialui/myClasses';
import TodoView from './TodoView';
import { Droppable } from 'react-beautiful-dnd';
import {useWindowSize} from 'react-use';

type InboxColumnPropsType = {
	todoList : Todo[]
}

function InboxColumn(props : InboxColumnPropsType) {

	const classes = myClasses.useStyles();
	const { width, height } = useWindowSize();
	return(
		<Box className={classes.todoContainer} sx={{flexGrow:1, height:height-180}}>
			<Typography variant="h4" className={classes.inbox + " " + classes.columnTitle}>
					Inbox
			</Typography>
			<Droppable
				droppableId={"inbox"}
			>
				{(provided)=>(
					<Box
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={classes.taskList}
					>
						{props.todoList.filter(todo=>!todo.completed&&todo.start===null).sort((a,b)=>{return a.due.getTime() -  b.due.getTime();}).map((todo,index)=>(
							<TodoView todo={todo} key={todo.id} index={index}/>
						))}
						{provided.placeholder}
					</Box>
				)}
			</Droppable>

		</Box>
	);
}

export default InboxColumn;