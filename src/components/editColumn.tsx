import React from 'react';
import {Box,Typography} from '@mui/material';
import {Todo} from '../types/type';
import myClasses from '../materialui/myClasses';
import TodoView from './TodoView';
import { Droppable } from 'react-beautiful-dnd';
import {useWindowSize} from 'react-use';

type EditColumnPropsType = {
}

function EditColumn(props : EditColumnPropsType) {

	const classes = myClasses.useStyles();
	const { width, height } = useWindowSize();
	return(
		<Box className={classes.todoContainer} sx={{flexGrow:1, height:120}}>
			<Typography variant="h4" className={classes.columnTitle}>
					Edit
			</Typography>
			<Droppable
				droppableId={"edit"}
			>
				{(provided)=>(
					<Box 
					ref={provided.innerRef}
					{...provided.droppableProps}
					className={classes.taskList}>
						{provided.placeholder}
					</Box>
				)}
			</Droppable>
		</Box>
	);
}

export default EditColumn;