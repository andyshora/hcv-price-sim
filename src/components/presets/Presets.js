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
    maxWidth: 800,
    padding: 0,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    whiteSpace: 'nowrap',
  },
}))

export default function InsetList({
  items,
  onItemSelected,
  replaceMode = false,
}) {
  const classes = useStyles()

  function handleItemSelected(i, item) {
    if (typeof onItemSelected === 'function') {
      onItemSelected(i, item)
    }
  }

  const SubHeader = (
    <ListSubheader>
      <Typography variant="h4" component="h4">
        Presets
      </Typography>
    </ListSubheader>
  )

  const itemStyles = replaceMode
    ? {
        background: 'rgba(255, 255, 255, 0.3)',
        border: '1px dashed white',
        marginRight: 1,
      }
    : { border: '1px solid transparent', marginRight: 1 }

  return (
    <Paper style={{ position: 'relative', zIndex: 11 }}>
      <List component="nav" className={classes.root} aria-label="Presets">
        {items.map((item, i) => (
          <ListItem
            key={`item-${item.x}-${item.y}`}
            button={true}
            onClick={e => {
              handleItemSelected(i, item)
            }}
            dense={true}
            style={itemStyles}
          >
            {i < icons.length && (
              <ListItemIcon>{React.createElement(icons[i])}</ListItemIcon>
            )}
            <ListItemText primary={item.label || `+${item.x}, ${item.y}k`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
