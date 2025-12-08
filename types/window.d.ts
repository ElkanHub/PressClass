import { Node } from 'reactflow';

declare global {
    interface Window {
        __REACT_FLOW_NODES__?: Node[];
        __WHITEBOARD_SELECTED__?: Node;
    }
}

export { };
