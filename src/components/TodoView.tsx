import {yellow,blue,green,orange,red} from '@mui/material/colors';
import {Card,Box} from '@mui/material';
import {Todo} from '../types/type';
import myClasses from '../materialui/myClasses';
import {DueViewer} from './dueViewer';
import { Draggable } from 'react-beautiful-dnd';

type TodoViewPropsType = {
	todo : Todo,
	index : number
}

function TodoView(props : TodoViewPropsType) {
	const color_dict = {"red":red[500],"yellow":yellow[500],"orange":orange[500],"green":green[500],"blue":blue[500]};
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
				{props.todo.completed ?
				<Box className={classes.todoViewTitle} >
					{props.todo.title}
				</Box>
				:
				<Box className={classes.todoViewTitle} sx={{color:color_dict[props.todo.color]}}>
					{props.todo.title}
				</Box>
				}
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