import styled from 'styled-components';
import { colors } from '@keen.io/colors';
import { UI_LAYERS } from '@keen.io/ui-core';

export const Container = styled.div`
  .react-grid-layout {
    height: 20px;
    position: relative;
    transition: height 200ms ease;
  }
  .react-grid-item {
    transition: all 200ms ease;
    transition-property: left, top;

    &:hover {
      z-index: 1;
    }
  }
  .react-grid-item img {
    pointer-events: none;
    user-select: none;
  }
  .react-grid-item.cssTransforms {
    transition-property: transform;
  }
  .react-grid-item.resizing {
    z-index: 1;
    will-change: width, height;
  }
  .react-grid-item.react-draggable-dragging {
    transition: none;
    z-index: 3;
    will-change: transform;
    cursor: grabbing;
  }

  .react-grid-item.dropping {
    visibility: hidden;
  }

  .react-grid-item.react-grid-placeholder {
    background: none;
    border: 1px dashed ${colors.gray[500]};
    box-sizing: border-box;
    transition-duration: 100ms;
    z-index: 2;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    cursor: grabbing;
  }

  .react-grid-item > .react-resizable-handle {
    position: absolute;
    width: 30px;
    height: 30px;
    padding: 5px;
    opacity: 0;
    z-index: ${UI_LAYERS.tooltip};

    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  }

  .react-grid-item.react-resizable:hover > .react-resizable-handle {
    opacity: 1;
  }

  .react-resizable-hide > .react-resizable-handle {
    display: none;
  }

  .react-grid-item > .react-resizable-handle.react-resizable-handle-sw {
    bottom: 0;
    left: 0;
    cursor: sw-resize;
    transform: rotate(90deg);
  }
  .react-grid-item > .react-resizable-handle.react-resizable-handle-se {
    bottom: 0;
    right: 0;
    cursor: se-resize;
  }
  .react-grid-item > .react-resizable-handle.react-resizable-handle-nw {
    top: 0;
    left: 0;
    cursor: nw-resize;
    transform: rotate(180deg);
  }
  .react-grid-item > .react-resizable-handle.react-resizable-handle-ne {
    top: 0;
    right: 0;
    cursor: ne-resize;
    transform: rotate(270deg);
  }
  .react-grid-item > .react-resizable-handle.react-resizable-handle-w,
  .react-grid-item > .react-resizable-handle.react-resizable-handle-e {
    top: 50%;
    margin-top: -10px;
    cursor: ew-resize;
  }
  .react-grid-item > .react-resizable-handle.react-resizable-handle-w {
    left: 0;
    transform: rotate(135deg);
  }
  .react-grid-item > .react-resizable-handle.react-resizable-handle-e {
    right: 0;
    transform: rotate(315deg);
  }
  .react-grid-item > .react-resizable-handle.react-resizable-handle-n,
  .react-grid-item > .react-resizable-handle.react-resizable-handle-s {
    left: 50%;
    margin-left: -10px;
    cursor: ns-resize;
  }
  .react-grid-item > .react-resizable-handle.react-resizable-handle-n {
    top: 0;
    transform: rotate(225deg);
  }
  .react-grid-item > .react-resizable-handle.react-resizable-handle-s {
    bottom: 0;
    transform: rotate(45deg);
  }
`;
