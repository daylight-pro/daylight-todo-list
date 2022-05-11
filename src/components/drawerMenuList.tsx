import {List,ListItem,Divider,ListItemText,ListItemAvatar,Badge,Box} from '@mui/material'

import InboxIcon from '@mui/icons-material/Inbox';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import EventIcon from '@mui/icons-material/Event';
import RepeatIcon from '@mui/icons-material/Repeat';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeIcon from '@mui/icons-material/Home';
import {TodoType} from "../types/type"
type drawerMenuListPropsType = {
	mode:String,
	changed: (info:TodoType) => void,
	inboxCount: number,
	inboxSoonCount: number,
	workingCount: number,
	workingSoonCount: number
}

function drawerMenuList(props:drawerMenuListPropsType){
	return(
	<List>
		<ListItem button selected={props.mode==="Inbox"} key={"inbox"} onClick={()=>props.changed("Inbox")}>
			<ListItemAvatar>
				<InboxIcon/>
			</ListItemAvatar>
			<Box component="div" display="inline">
			<ListItemText
				primary={"インボックス"}
			/>
			</Box>
			{props.inboxCount!==0&&
				<Box component="div" ml={props.inboxSoonCount === 0?4:2.5} display="inline">
					<Badge badgeContent={props.inboxCount} color="primary">
					</Badge>
				</Box>
			}
			{props.inboxSoonCount!==0&&
			<Box component="div" ml={props.inboxCount === 0?4:3} display="inline">
				<Badge badgeContent={props.inboxSoonCount} color="secondary">
					
				</Badge>
			</Box>
			}
		</ListItem>
		<Divider component="li"/>
		<ListItem button selected={props.mode==="Working"} key={"working"} onClick={()=>props.changed("Working")}>
			<ListItemAvatar>
				<PlayCircleFilledIcon/>
			</ListItemAvatar>
			<ListItemText
				primary={"実行中"}
			/>
			{props.workingCount !== 0 &&
			<Box component="div" ml={props.workingSoonCount === 0?4:2.5} display="inline">
				<Badge badgeContent={props.workingCount} color="primary">
				</Badge>
			</Box>
			}
			{props.workingSoonCount !== 0 &&
			<Box component="div" ml={props.workingCount === 0?4:3} display="inline">
				<Badge badgeContent={props.workingSoonCount} color="secondary">
					
				</Badge>
			</Box>
			}
		</ListItem>
		<Divider component="li"/>
		<ListItem button selected={props.mode==="Later"} key={"later"} onClick={()=>props.changed("Later")}>
			<ListItemAvatar>
				<EventIcon/>
			</ListItemAvatar>
			<ListItemText
				primary={"未着手"}
			/>
		</ListItem>
		<Divider component="li"/>
		<ListItem button  selected={props.mode==="Repeat"} key={"repeat"} onClick={()=>props.changed("Repeat")}>
			<ListItemAvatar>
				<RepeatIcon/>
			</ListItemAvatar>
			<ListItemText
				primary={"繰り返し"}
			/>
		</ListItem>
		<Divider component="li"/>
		<ListItem button selected={props.mode==="All"}  key={"all"} onClick={()=>props.changed("All")}>
			<ListItemAvatar>
				<ListAltIcon/>
			</ListItemAvatar>
			<ListItemText
				primary={"全て"}
			/>
		</ListItem>
		<Divider component="li"/>
		<ListItem button selected={props.mode==="Home"}  key={"all"} onClick={()=>props.changed("Home")}>
			<ListItemAvatar>
				<HomeIcon/>
			</ListItemAvatar>
			<ListItemText
				primary={"ホーム"}
			/>
		</ListItem>
		<Divider component="li"/>
	</List>
	)
}

export default drawerMenuList
