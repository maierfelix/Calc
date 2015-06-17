![NovaeCalc](http://i.imgur.com/hYWetxs.png)

# Description
NovaeCalc is a lightning browserbased spreadsheet software.<br/>
NovaeCalc is not stable yet.<br/>
NovaeCalc runs the best on Google Chrome.

# Multi-user test project
If you want to test the latest multi-user functionality, go to:
* [Link](http://felixmaier.info/NovaeCalc/?testroom1)<br/>
Master key: *3b011508e1edb8a92daca0c72522b4449aa455c820009ce1b4a838c868d6c4b8*

## Current state:

 - [ ] Cells
   - [x] Infinite vertical scrolling (~ 2^53 - 1)
   - [x] Infinite horizontal scrolling (~ 16.100)
   - [x] Select cell fields in all directions
   - [x] Resize cell rows
   - [x] Edit cell content
   - [ ] Adjust cell size to its content 
   - [x] Custom cell styles
   - [ ] Mobile friendly
   - [x] Realtime cells
   - [x] Insert, delete columns and rows
   - [x] Glossy, outer border selection fields
   - [ ] Formula / Cell content extending (horizontal, vertical, numbers, strings)
   - [ ] Copy / Paste / Delete cells

 - [ ] Functionalities
   - [x] Export projects
   - [x] Import project
   - [ ] Backup projects into LocalStorage
   - [ ] Undo, redo stack
   - [x] Multiple sheets
   - [x] Delete sheets
   - [x] System speed optimization
   - [ ] Jump to (x, y)
   - [ ] Debug

- [ ] Formula logic
   - [ ] Syntax
   - [ ] Multi-language support
   - [ ] String functions
   - [x] Numeric functions
   - [ ] Statistical functions
   - [ ] Logical functions
   - [ ] Information functions
   - [ ] Date / Time functions
   - [x] JSON processing
   - [ ] Cell ranges
   - [ ] Multi-sheet cell references

- [ ] Server
   - [x] Rooms
   - [x] Room passwords
   - [x] Users
   - [x] Roles
   - [x] Share rooms
   - [x] Multi-user cell editing
   - [ ] Multi-user cell styling
   - [ ] Multi-user cell resizing
   - [x] Multi-sheet support
   - [ ] Delete sheets
   - [ ] Count users in current sheet
   - [ ] Synchronization
   - [ ] Screen mirroring
   - [ ] Save styling as ranges

## Todo:
- [ ] Pow support: Math.pow => (2^2)^2, LX_POW

## Bugs:
- [ ] Deep formula variable reference execution
- [ ] Key scrolling
- [ ] Reversed selection extending doesnt work
- [ ] Reversed selection resize ghost switch bug

## Notes:
- [ ] Possibly include server-side cell calculation option
- [ ] Pow higher priority than multiply

## Libraries
 * [ImportJS](https://github.com/felixmaier/ImportJS)
 * [Eight Bit Color Picker](https://github.com/bilalq/eight-bit-color-picker)
 * [Fastclick](https://github.com/ftlabs/fastclick)
 * [Mui](https://github.com/muicss/mui)
 * [Socket.io](https://github.com/Automattic/socket.io)
