import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import SketchPad from '../components/SketchPad';
import { TOOL_PENCIL } from '../components/tools/Pencil';
import { TOOL_LINE } from '../components/tools/Line';
import { TOOL_ELLIPSE } from '../components/tools/Ellipse';
import { TOOL_RECTANGLE } from '../components/tools/Rectangle';
import { TOOL_BRUSH } from '../components/tools/Brush';
import { TOOL_ERASER } from '../components/tools/Eraser';
import Sidebar from '../components/Sidebar';
import PoppedOutShare from '../components/PoppedOutShare.jsx';
import ColorPicker from '../components/ColorPicker';
import FillPicker from '../components/FillPicker';
import logo from '../icons/007-square.png';
import pencil from '../icons/011-tool.png'
import line from '../icons/008-two.png'
import circle from '../icons/009-circle.png'
import sqaure from '../icons/010-square.png'
import textbox from '../icons/symbols.png'
import paint from '../icons/paint.png'
import save from '../icons/001-symbols-1.png'
import clear from '../icons/001-circle.png'
import eraser from '../icons/eraser.png'

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
      items: this.props.items,
      poppedOpen: false
    }
    this.handleShare = this.handleShare.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  componentWillReceiveProps ({undo}) {
    if (undo) {
      this.refs.sketch.handleClear()
    }
  }

  changeColor(color) {
    this.setState({
      color: color
    })
  }

  changeFill(color) {
    this.setState({
      fillColor: color
    })
  }

  handleShare = () => {
    this.setState({
      poppedOpen: true
    })
  }

  closePopup = () => {
    this.setState({
      poppedOpen: false
    })
  }


render() {
    const { tool, size, color, fill, fillColor } = this.state;
    return (
      <div>
        <Link  style={{ textDecoration: 'none', color: 'black' }} to='/'><h1><img className='logo' src={logo} />TWOODLE</h1></Link>
        <p>{this.state.items}</p>
        <Sidebar onShare={this.handleShare} />
        <PoppedOutShare isOpen={this.state.poppedOpen} onClose={this.closePopup} url={this.props.boardName}/>
        <div className='toolbar'>
          <div className="tools" style={{marginBottom:20}}>
           <button
             onClick={() => this.props.undoAnItem(this.props.items[this.props.items.length - 1], this.props.boardName)}
           >undo</button>

          <button
           onClick={() => this.refs.sketch.handleClear()}><img className='icon' src={clear} /> </button>

          <button
           onClick={() => this.refs.sketch.handleSave()}><img className='icon' src={save} /> </button>

            <button
              style={tool == TOOL_PENCIL ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_PENCIL  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_PENCIL})}
            ><img className='icon' src={pencil} /></button>

            <button
              style={tool == TOOL_BRUSH ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_BRUSH  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_BRUSH})}
            ><img className='icon' src={paint} /></button>

            <button
              style={tool == TOOL_LINE ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_LINE  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_LINE})}
            ><img className='icon' src={line} /></button>

            <button
              style={tool == TOOL_ELLIPSE ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_ELLIPSE  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_ELLIPSE})}
            ><img className='icon' src={circle} /></button>

            <button
              style={tool == TOOL_RECTANGLE ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_RECTANGLE  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_RECTANGLE})}
            ><img className='icon' src={sqaure} /></button>

            <button
              style={tool == TOOL_ERASER ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_ERASER  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_ERASER})}
            ><img className='icon' src={eraser} /></button>
          </div>
          <div className="options" style={{marginBottom:20}}>
            <label htmlFor="">SIZE: </label>
            <input min="1" max="20" type="range" value={size} onChange={(e) => this.setState({size: parseInt(e.target.value)})} />
            <ColorPicker value={color} newColor={this.changeColor.bind(this)}/>
          </div>
          {(this.state.tool == TOOL_ELLIPSE || this.state.tool == TOOL_RECTANGLE) ?
            <div className='fill'>
              <label htmlFor="">FILL IN:</label>
              <input className="checkbox" type="checkbox" value={fill} style={{margin:'0 8'}}
                     onChange={(e) => this.setState({fill: e.target.checked})} />
              {fill ? <span>
                  <FillPicker value={fill} newFill={this.changeFill.bind(this)}/>
                </span> : ''}
            </div> : ''}
          </div>
        <div style={{float:'left', marginRight:20}}>
          <SketchPad
            ref='sketch'
            width={2000}
            height={1200}
            animate={false}
            size={size}
            color={color}
            fillColor={fill ? fillColor : ''}
            items={this.props.items}
            tool={tool}
            onCompleteItem={(item) => this.props.addNewItem(item, this.props.boardName)}
            onSave={this.handleSave}
          />
        </div>
      </div>
    );
  }
}