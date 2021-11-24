import React, { useState } from 'react';
import {Card,Typography,Box} from '@mui/material';
import {Todo} from '../types/type';
import myClasses from '../materialui/myClasses';
import {DueViewer} from './dueViewer';
import { Draggable } from 'react-beautiful-dnd';

type TodoViewPropsType = {
	todo : Todo,
	index : number
}

function TodoView(props : TodoViewPropsType) {

	const classes = myClasses.useStyles();
	return(
		<Box>

		{ props.todo.note === "DayHeader" ? 
			<Draggable 
			isDragDisabled={true}
			draggableId={props.todo.title}
			index={props.index}>
				{(provided)=>(
				<Box 
				ref={provided.innerRef}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				className={classes.dayHeader}>{props.todo.title}</Box>
				)}
			</Draggable>
		:<Draggable
			draggableId={props.todo.id}
			index={props.index}
		>
		{(provided)=>(
			<Card 
				variant="outlined"
				ref={provided.innerRef}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
			>
				<Box className={classes.todoViewTitle} >
					{props.todo.title}
				</Box>
				<Box className={classes.todoViewDate}>
					<DueViewer due={props.todo.due}/>
				</Box>
			</Card>
		)}
		</Draggable>
		}
		</Box>
		
	);
}

export default TodoView;