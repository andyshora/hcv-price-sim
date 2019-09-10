import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const NumberedIcon = styled.div`
  display: inline-flex;
  color: white;
  width: 24px;
  height: 24px;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-right: 3px;
  box-shadow: 1px 1px 0px rgba(255, 255, 255, 0.5);
`

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 800,
    padding: 0,
    display: 'flex',
    whiteSpace: 'nowrap',
  },
  listItem: {
    padding: '0 8px 0 0',
  },
}))

export default function InsetList({
  items,
  onItemSelected,
  replaceMode = false,
  storageKey = 'presets',
  labelFormatter = l => l,
}) {
  console.log('items', items)
  const classes = useStyles()

  function handleItemSelected(i, item) {
    if (typeof onItemSelected === 'function') {
      onItemSelected(i, item, items, storageKey)
    }
  }

  const itemStyles = replaceMode
    ? {
        background: 'rgba(255, 255, 255, 0.3)',
        border: '1px dashed white',
        marginRight: 1,
      }
    : { border: '1px solid transparent', marginRight: 1 }

  return (
    <div style={{ position: 'relative', zIndex: 11 }}>
      <List component="nav" className={classes.root} aria-label="Presets">
        {items.map((item, i) => (
          <ListItem
            className={classes.listItem}
            key={`item-${item.x}-${item.y}-${i}`}
            button={true}
            onClick={e => {
              handleItemSelected(i, item)
            }}
            dense={true}
            style={itemStyles}
          >
            <NumberedIcon>
              <span>{i + 1}</span>
            </NumberedIcon>
            <ListItemText primary={item.label || labelFormatter(item)} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}
