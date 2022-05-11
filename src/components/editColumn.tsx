import React from 'react';
import {Box,Typography} from '@mui/material';
import myClasses from '../materialui/myClasses';
import { Droppable } from 'react-beautiful-dnd';

type EditColumnPropsType = {
}

function EditColumn(props : EditColumnPropsType) {

	const classes = myClasses.useStyles();
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