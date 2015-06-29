![NovaeCalc](http://i.imgur.com/hYWetxs.png)

# Description
[![Join the chat at https://gitter.im/felixmaier/NovaeCalc](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/felixmaier/NovaeCalc?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)<br>
NovaeCalc is a lightning browserbased spreadsheet software.<br/>
NovaeCalc is not stable yet.<br/>
NovaeCalc runs the best on Google Chrome.

# Multi-user test project
If you want to test the latest multi-user functionality, go to:
* [Link](http://felixmaier.info/NovaeCalc/?testroom1&key=3b011508e1edb8a92daca0c72522b4449aa455c820009ce1b4a838c868d6c4b8)<br/>

## Current state:

 - [ ] Cells
   - [x] Infinite vertical scrolling (~ 2^53 - 1)
   - [x] Infinite horizontal scrolling (~ 16.100)
   - [x] Select cell fields in all directions
   - [x] Resize cell rows and columns
   - [x] Edit cell content
   - [ ] Adjust cell size to its content 
   - [x] Custom cell styles
   - [ ] Mobile friendly
   - [x] Realtime cells
   - [x] Insert, delete columns and rows
   - [x] Glossy, outer border selection fields
   - [ ] Formula / Cell content extending (horizontal, vertical, numbers, strings)
   - [x] Copy / Paste / Delete / Cut Out cells

 - [ ] Functionalities
   - [x] Export projects
   - [x] Import project
   - [ ] Backup last project state into LocalStorage
   - [ ] Undo, redo stack
   - [x] Multiple sheets
   - [x] Delete sheets
   - [x] System speed optimization
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

- [ ] Script logic
   - [ ] Sheets
   - [x] Ranges

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
   - [x] Delete sheets
   - [x] Count users in current sheet
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
- [ ] Styling bug on master column and row background styling (scrolledXY > Settings.xy)

## Notes:
- [ ] Pow higher priority than multiply

## Licensing
### BSD License:
 - [NovaeCalc](https://github.com/felixmaier/NovaeCalc/blob/master/LICENSE.BSD)

### MIT License:
 - [Eight Bit Color Picker](https://github.com/bilalq/eight-bit-color-picker/blob/master/LICENSE)
 - [Fastclick](https://github.com/ftlabs/fastclick/blob/master/LICENSE)
 - [Mui](https://github.com/muicss/mui/blob/master/LICENSE.txt)
 - [Socket.io](https://github.com/Automattic/socket.io/blob/master/LICENSE)
 - [Codemirror](https://github.com/codemirror/CodeMirror/blob/master/LICENSE)
 - [Vm.js](https://github.com/tarruda/vm.js/blob/master/LICENSE-MIT)
