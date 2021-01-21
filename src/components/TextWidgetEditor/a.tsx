// import React from 'react';
// import './App.css';
// import {
//   Editor,
//   EditorState,
//   RichUtils,
//   getDefaultKeyBinding,
//   KeyBindingUtil,
// } from 'draft-js';
//
// function keyBindingFunction(event) {
//   if (
//     KeyBindingUtil.hasCommandModifier(event) &&
//     event.shiftKey &&
//     event.key === 'x'
//   ) {
//     return 'strikethrough';
//   }
//
//   if (
//     KeyBindingUtil.hasCommandModifier(event) &&
//     event.shiftKey &&
//     event.key === '7'
//   ) {
//     return 'ordered-list';
//   }
//
//   if (
//     KeyBindingUtil.hasCommandModifier(event) &&
//     event.shiftKey &&
//     event.key === '8'
//   ) {
//     return 'unordered-list';
//   }
//
//   if (
//     KeyBindingUtil.hasCommandModifier(event) &&
//     event.shiftKey &&
//     event.key === '9'
//   ) {
//     return 'blockquote';
//   }
//
//   return getDefaultKeyBinding(event);
// }
//
// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       editorState: EditorState.createEmpty(),
//     };
//
//     this.onChange = this.onChange.bind(this);
//     this.handleKeyCommand = this.handleKeyCommand.bind(this);
//     this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
//     this.toggleBlockType = this.toggleBlockType.bind(this);
//   }
//
//   onChange(editorState) {
//     this.setState({ editorState });
//   }
//
//   handleKeyCommand(command) {
//     // inline formatting key commands handles bold, italic, code, underline
//     var editorState = RichUtils.handleKeyCommand(
//       this.state.editorState,
//       command
//     );
//
//     if (!editorState && command === 'strikethrough') {
//       editorState = RichUtils.toggleInlineStyle(
//         this.state.editorState,
//         'STRIKETHROUGH'
//       );
//     }
//
//     if (!editorState && command === 'blockquote') {
//       editorState = RichUtils.toggleBlockType(
//         this.state.editorState,
//         'blockquote'
//       );
//     }
//
//     if (!editorState && command === 'ordered-list') {
//       editorState = RichUtils.toggleBlockType(
//         this.state.editorState,
//         'ordered-list-item'
//       );
//     }
//
//     if (!editorState && command === 'unordered-list') {
//       editorState = RichUtils.toggleBlockType(
//         this.state.editorState,
//         'unordered-list-item'
//       );
//     }
//
//     if (editorState) {
//       this.setState({ editorState });
//       return 'handled';
//     }
//
//     return 'not-handled';
//   }
//
//   toggleInlineStyle(event) {
//     event.preventDefault();
//
//     let style = event.currentTarget.getAttribute('data-style');
//     this.setState({
//       editorState: RichUtils.toggleInlineStyle(this.state.editorState, style),
//     });
//   }
//
//   toggleBlockType(event) {
//     event.preventDefault();
//
//     let block = event.currentTarget.getAttribute('data-block');
//     this.setState({
//       editorState: RichUtils.toggleBlockType(this.state.editorState, block),
//     });
//   }
//
//   renderBlockButton(value, block) {
//     return (
//       <input
//         type="button"
//         key={block}
//         value={value}
//         data-block={block}
//         onMouseDown={this.toggleBlockType}
//       />
//     );
//   }
//
//   renderInlineStyleButton(value, style) {
//     return (
//       <input
//         type="button"
//         key={style}
//         value={value}
//         data-style={style}
//         onMouseDown={this.toggleInlineStyle}
//       />
//     );
//   }
//
//   render() {
//     const inlineStyleButtons = [
//       {
//         value: 'Bold',
//         style: 'BOLD',
//       },
//
//       {
//         value: 'Italic',
//         style: 'ITALIC',
//       },
//
//       {
//         value: 'Underline',
//         style: 'UNDERLINE',
//       },
//
//       {
//         value: 'Strikethrough',
//         style: 'STRIKETHROUGH',
//       },
//
//       {
//         value: 'Code',
//         style: 'CODE',
//       },
//     ];
//
//     const blockTypeButtons = [
//       {
//         value: 'Heading One',
//         block: 'header-one',
//       },
//
//       {
//         value: 'Heading Two',
//         block: 'header-two',
//       },
//
//       {
//         value: 'Heading Three',
//         block: 'header-three',
//       },
//
//       {
//         value: 'Blockquote',
//         block: 'blockquote',
//       },
//
//       {
//         value: 'Unordered List',
//         block: 'unordered-list-item',
//       },
//
//       {
//         value: 'Ordered List',
//         block: 'ordered-list-item',
//       },
//     ];
//
//     return (
//       <div className="my-little-app">
//         <h1>Playing with Draft!</h1>
//         <div className="inline-style-options">
//           Inline Styles:
//           {inlineStyleButtons.map((button) => {
//             return this.renderInlineStyleButton(button.value, button.style);
//           })}
//         </div>
//
//         <div className="block-style-options">
//           Block Types:
//           {blockTypeButtons.map((button) => {
//             return this.renderBlockButton(button.value, button.block);
//           })}
//         </div>
//         <div className="draft-editor-wrapper">
//           <Editor
//             editorState={this.state.editorState}
//             onChange={this.onChange}
//             handleKeyCommand={this.handleKeyCommand}
//             keyBindingFn={keyBindingFunction}
//           />
//         </div>
//       </div>
//     );
//   }
// }
//
// export default App;
