import React, { Component } from 'react';
import SketchPad from './components/SketchPad';
import { TOOL_PENCIL } from './components/tools/Pencil';
import { TOOL_LINE } from './components/tools/Line';
import { TOOL_ELLIPSE } from './components/tools/Ellipse';
import { TOOL_RECTANGLE } from './components/tools/Rectangle';
import SideBar from './Sidebar';

export default class SketchApp extends Component
{
  socket = null;

  constructor(props) {
    super(props);

    this.state = {
      tool:TOOL_PENCIL,
      size: 2,
      color: '#000000',
      fill: false,
      fillColor: '#444444',
      items: []
    }
  }

  componentDidMount() {

    this.socket = new WebSocket("ws://localhost:3001")
    // Wait for new items and then add them to the DOM
    this.socket.onmessage = this.addNewItem;
  }


  // UPDATE THE STATE WITH THE NEW MESSAGES
  addNewItem = (receivedItem) => {
    // Parsed the recived messages object
    console.log(JSON.parse(receivedItem.data))
    this.setState({items: this.state.items.concat([JSON.parse(receivedItem.data)])})
  }

  render() {
    const { tool, size, color, fill, fillColor, items } = this.state;
    return (
      <div id="outer-container">
      <SideBar />
      <main id="page-wrap">
        <h1 className='brand'>TWOODLE</h1>
        <div style={{float:'left', marginRight:20}}>
          <SketchPad
            width={500}
            height={500}
            animate={true}
            size={size}
            color={color}
            fillColor={fill ? fillColor : ''}
            items={items}
            tool={tool}
            onCompleteItem={(item) => this.socket.send(JSON.stringify(item))}
          />
        </div>
        <div style={{float:'left'}}>
          <div className="tools" style={{marginBottom:20}}>
            <button
              style={tool == TOOL_PENCIL ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_PENCIL  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_PENCIL})}
            >Pencil</button>
            <button
              style={tool == TOOL_LINE ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_LINE  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_LINE})}
            >Line</button>
            <button
              style={tool == TOOL_ELLIPSE ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_ELLIPSE  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_ELLIPSE})}
            >Ellipse</button>
            <button
              style={tool == TOOL_RECTANGLE ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_RECTANGLE  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_RECTANGLE})}
            >Rectangle</button>
          </div>
          <div className="options" style={{marginBottom:20}}>
            <label htmlFor="">size: </label>
            <input min="1" max="20" type="range" value={size} onChange={(e) => this.setState({size: parseInt(e.target.value)})} />
          </div>
          <div className="options" style={{marginBottom:20}}>
            <label htmlFor="">color: </label>
            <input type="color" value={color} onChange={(e) => this.setState({color: e.target.value})} />
          </div>
          {(this.state.tool == TOOL_ELLIPSE || this.state.tool == TOOL_RECTANGLE) ?
            <div>
              <label htmlFor="">fill in:</label>
              <input type="checkbox" value={fill} style={{margin:'0 8'}}
                     onChange={(e) => this.setState({fill: e.target.checked})} />
              {fill ? <span>
                  <label htmlFor="">with color:</label>
                  <input type="color" value={fillColor} onChange={(e) => this.setState({fillColor: e.target.value})} />
                </span> : ''}
            </div> : ''}
        </div>
        </main>
      </div>
    );
  }
}