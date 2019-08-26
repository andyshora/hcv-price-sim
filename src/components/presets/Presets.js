import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

import LooksOneIcon from '@material-ui/icons/LooksOne'
import LooksTwoIcon from '@material-ui/icons/LooksTwo'
import LooksThreeIcon from '@material-ui/icons/Looks3'
import LooksFourIcon from '@material-ui/icons/Looks4'
import LooksFiveIcon from '@material-ui/icons/Looks5'

import theme from '../../theme'

const icons = [
  LooksOneIcon,
  LooksTwoIcon,
  LooksThreeIcon,
  LooksFourIcon,
  LooksFiveIcon,
]

const useStyles = makeStyles(theme => ({
  root: {
    width: 240,
    maxWidth: 360,
    padding: '1rem 0.5rem',
    backgroundColor: theme.palette.background.paper,
  },
}))

export default function InsetList({ items, onItemSelected }) {
  const classes = useStyles()

  function handleItemSelected(item) {
    if (typeof onItemSelected === 'function') {
      onItemSelected(item)
    }
  }

  const SubHeader = (
    <ListSubheader>
      <Typography variant="h4" component="h4">
        Presets
      </Typography>
    </ListSubheader>
  )

  return (
    <Paper style={{ position: 'relative', zIndex: 11 }}>
      <List
        component="nav"
        className={classes.root}
        aria-label="Presets"
        subheader={SubHeader}
      >
        {items.map((item, i) => (
          <ListItem
            key={`item-${item.x}-${item.y}`}
            button={true}
            onClick={(e, i) => {
              handleItemSelected(item)
            }}
            dense={true}
          >
            {i < icons.length && (
              <ListItemIcon>{React.createElement(icons[i])}</ListItemIcon>
            )}
            <ListItemText
              primary={item.label || `CPP ${item.y}k, Cure +${item.x}%`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
