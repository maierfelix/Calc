# NovaeCalc
![NovaeCalc](http://i.imgur.com/irzQbPn.png)

# Description
NovaeCalc is a lightning browserbased spreadsheet software.<br/>
NovaeCalc is not stable yet.<br/>
NovaeCalc runs the best on Google Chrome.

## Current state:

 - [ ] Cell logic
   - [x] Infinite vertical scrolling (~ 2^53 - 1)
   - [x] Infinite horizontal scrolling (~ 16.100)
   - [x] Select cell fields in all directions
   - [x] Resize cell rows
   - [x] Edit cell content
   - [ ] Adjust cell size to its content 
   - [x] Custom cell styles
   - [ ] Mobile friendly
   - [x] Realtime cells
   - [x] Insert, delete columns
   - [x] Insert, delete rows

 - [ ] Functionalities
   - [x] Export projects
   - [x] Import project
   - [ ] Backup projects into LocalStorage
   - [ ] Undo, redo stack
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

- [ ] Server
   - [x] Rooms
   - [x] Room passwords
   - [x] Users
   - [x] Roles
   - [x] Share rooms
   - [x] Multi-user live editing
   - [ ] Synchronization
   - [ ] Screen mirroring

## Todo:
- [ ] Pow support: Math.pow => (2^2)^2, LX_POW

## Notes:
- [ ] Possibly include server-side cell calculation option
- [ ] Pow higher priority than multiply

## Libraries
 * [ImportJS](https://github.com/felixmaier/ImportJS)
 * [Eight Bit Color Picker](https://github.com/bilalq/eight-bit-color-picker)
 * [Fastclick](https://github.com/ftlabs/fastclick)
 * [Mui](https://github.com/muicss/mui)
 * [Socket.io](https://github.com/Automattic/socket.io)
