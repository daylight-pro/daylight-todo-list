import React from 'react';
import {List,ListItem,Divider,ListItemText, Typography,Box,Checkbox,Collapse,ListItemIcon,IconButton} from '@mui/material'
import RepeatIcon from '@mui/icons-material/Repeat';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {RepeatTodo} from '../../types/type'
import Util from '../../Util'
import {DueViewer} from '../../components/dueViewer';
import myClasses from '../../materialui/myClasses';

type RepeatPropsType = {
	repeatList: RepeatTodo[],
	repeatClicked: React.Dispatch<React.SetStateAction<RepeatTodo | null>>,
	isOpenSubtasks:{
		[key: string]: boolean;
	},
	setIsOpenSubtasks: React.Dispatch<React.SetStateAction<{
		[key: string]: boolean;
	}>>,
	edit:(repeat: RepeatTodo, hidden?: boolean) => void
}

function Repeat(props: RepeatPropsType){
	const repeatList = props.repeatList;
	repeatList.sort((a,b)=>{
		return a.due.getTime() - b.due.getTime();
	});
	const classes = myClasses.useStyles();
	const handleExpandMore = (e:React.MouseEvent<SVGSVGElement, MouseEvent>, todo:RepeatTodo)=>{
		console.log(props.isOpenSubtasks);
		e.stopPropagation();
		const newS =  Object.create(props.isOpenSubtasks);
		newS[todo.title] = true;
		props.setIsOpenSubtasks(newS);
	}
	const handleExpandLess = (e:React.MouseEvent<SVGSVGElement, MouseEvent>, todo:RepeatTodo)=>{
		e.stopPropagation();
		const newS = Object.create(props.isOpenSubtasks);
		newS[todo.title] = false;
		props.setIsOpenSubtasks(newS);
	}
	const handleSubChange = (todo:RepeatTodo, title:string) =>{
		todo.subTasks.forEach((sub=>{
			if(sub.title === title){
				sub.completed = !sub.completed;
			}
		}));
		props.edit(todo,true);
	}
	return(
	<React.Fragment>
		<Box  mt={4} mb={2} className={classes.repeat}>
		<Typography variant="h4">
			<RepeatIcon className={classes.titleIcon} fontSize='large' sx={{mr:4}}/> 繰り返し
		</Typography>
		</Box>
		<List>
			{/*受け取ったtodoListを使って表示する*/}
			{repeatList.map((repeat) => (
				<React.Fragment>
				<ListItem button alignItems="flex-start" key={repeat.id} onClick={() => {props.repeatClicked(repeat)}}>
					<ListItemText
						primary={<Typography
								variant={"h6"}
							>
								{repeat.title}
							</Typography>
						}
						secondary={
							<React.Fragment>
								<DueViewer due={repeat.due} repeat={true}/>
							</React.Fragment>
						}
					/>
					<IconButton className={classes.button}>
					{Util.canOpenDetail(repeat)&&(Util.isOpenDetail(repeat,props.isOpenSubtasks)?<ExpandLess className={classes.expandButton} onClick={(e)=>handleExpandLess(e,repeat)}/>:<ExpandMore className={classes.expandButton} onClick={(e)=>handleExpandMore(e,repeat)}/> )}
					</IconButton>
					</ListItem><Collapse in={props.isOpenSubtasks[repeat.title] === true} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{repeat.subTasks.map((sub)=>{
							return(
							<ListItem button className={classes.nested} key={sub.title}>
								<ListItemIcon>
								<Checkbox
									checked={sub.completed}
									inputProps={{'aria-label':'primary checkbox'}}
									onChange={()=>{handleSubChange(repeat,sub.title)}}
									onClick={(e)=>{
										e.stopPropagation();
									}}
								/>
								</ListItemIcon>
								<ListItemText primary={sub.completed?
										<Typography
											style={{textDecoration: "line-through"}}
										>
											{sub.title}
										</Typography>
										:
										<Typography
										>
											{sub.title}
										</Typography>
									} />
							</ListItem>
							)
						})}
						</List>
					</Collapse>
				
				<Divider component="li"/>
				</React.Fragment>
			))}
	</List>
	</React.Fragment>
	);
}

export default Repeat;