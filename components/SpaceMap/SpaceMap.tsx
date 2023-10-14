import '../../styles/SpaceMap.css'

import { useCallback } from 'react';
import Image from 'next/image';
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/base.css';
import TurboNode, { TurboNodeData } from './TurboNode';
import TurboGroup, { TurboGroupData } from './TurboGroup';
import TurboEdge from './TurboEdge';
import ObjectIcon from 'public/assets/SVG/3DGraphics_Icon.svg'

interface Props {
  onMouseOver?: (event: React.SyntheticEvent) => void;
  isOpened: boolean;
}

const nodeTypes = {
  turbo: TurboNode,
  group: TurboGroup,
};

const edgeTypes = {
  turbo: TurboEdge,
};

const defaultEdgeOptions = {
  type: 'turbo',
  markerEnd: 'edge-circle',
};

const initialNodes: any = [
  {
    id: 'main',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Hermes Science's Lab", subline: 'Metaverse Space' },
    position: { x: 930, y: 0 },
    className: 'dark',
  },
  {
    id: 'studio',
    type: 'group',
    data: { title: "Prané Music Studio", subline: 'Music Workspace' },
    position: { x: 0, y: 150 },
    className: 'light',
    style: { backgroundColor: 'rgba(0, 115, 198, 0.2)', width: 360, height: 520, color: '#ffffff', border: '1px solid white' },
  },
  {
    id: 'awards',
    type: 'group',
    data: { title: "Awards and Honors", subline: "Trophy's Table" },
    position: { x: 400, y: 150 },
    className: 'light',
    style: { backgroundColor: 'rgba(0, 115, 198, 0.2)', width: 290, height: 520, color: '#ffffff', border: '1px solid white' },
  },
  {
    id: 'lobby',
    type: 'group',
    data: { title: "Metaverse Environments", subline: 'Lobby Space' },
    position: { x: 730, y: 150 },
    className: 'light',
    style: { backgroundColor: 'rgba(0, 115, 198, 0.2)', width: 270, height: 160, color: '#ffffff', border: '1px solid white' },
  },
  {
    id: 'library',
    type: 'group',
    data: { title: "Softwares Library", subline: 'Bookshelf' },
    position: { x: 1040, y: 150 },
    className: 'light',
    style: { backgroundColor: 'rgba(0, 115, 198, 0.2)', width: 310, height: 160, color: '#ffffff', border: '1px solid white' },
  },
  {
    id: 'rooftop',
    type: 'group',
    data: { title: "UX/Tech-Art Studio", subline: "High concentration space" },
    position: { x: 1390, y: 150 },
    className: 'light',
    style: { backgroundColor: 'rgba(0, 115, 198, 0.2)', width: 280, height: 160, color: '#ffffff', border: '1px solid white' },
  },
  {
    id: 'stairs',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Handmade Portfolio", subline: 'Framed Panel' },
    position: { x: 1710, y: 150 },
  },
  {
    id: 'aboutprane',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "About Prané", subline: "Prané's Logotype Panel" },
    position: { x: 20, y: 70 },
    parentNode: 'studio',
    extent: 'parent'
  },
  {
    id: 'mip',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Interactive Music", subline: "Monitor Screen Left" },
    position: { x: 20, y: 160 },
    parentNode: 'studio',
    extent: 'parent'
  },
  {
    id: 'filmscoring',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Music for Films", subline: "Monitor Screen Right" },
    position: { x: 20, y: 250 },
    parentNode: 'studio',
    extent: 'parent'
  },
  {
    id: 'cap',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Music Composition/Arrangement", subline: "Laptop Screen" },
    position: { x: 20, y: 340 },
    parentNode: 'studio',
    extent: 'parent'
  },
  {
    id: 'musicporfolio',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Music Portfolio", subline: "TV Screen" },
    position: { x: 20, y: 430 },
    parentNode: 'studio',
    extent: 'parent'
  },
  {
    id: 'mipymes',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Bussiness Creation", subline: "Trophy" },
    position: { x: 20, y: 70 },
    parentNode: 'awards',
    extent: 'parent'
  },
  {
    id: 'musiccontest',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Music Composition", subline: "Trophy" },
    position: { x: 20, y: 160 },
    parentNode: 'awards',
    extent: 'parent'
  },
  {
    id: 'bcrd',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Payment Methods", subline: "Trophy" },
    position: { x: 20, y: 250 },
    parentNode: 'awards',
    extent: 'parent'
  },
  {
    id: 'arqtur',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Architectural Design", subline: "Trophy" },
    position: { x: 20, y: 340 },
    parentNode: 'awards',
    extent: 'parent'
  },
  {
    id: 'literary',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Cinematographic Script", subline: "Trophy" },
    position: { x: 20, y: 430 },
    parentNode: 'awards',
    extent: 'parent'
  },
  {
    id: 'neumann',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Neumann's Paradise", subline: "3D Model" },
    position: { x: 20, y: 70 },
    parentNode: 'lobby',
    extent: 'parent'
  },
  {
    id: 'scrum',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Agile/Scrum Methodology", subline: "Group of Books" },
    position: { x: 20, y: 70 },
    parentNode: 'library',
    extent: 'parent'
  },
  {
    id: 'uxtech',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "UX/Tech-Art Portfolio", subline: "Digital Easel" },
    position: { x: 20, y: 70 },
    parentNode: 'rooftop',
    extent: 'parent'
  },
  {
    id: 'adobe',
    type: 'group',
    data: { title: "Adobe Suite", subline: "Bookshelf Area" },
    position: { x: 730, y: 400 },
    className: 'light',
    style: { backgroundColor: 'rgba(0, 115, 198, 0.2)', width: 270, height: 610, color: '#ffffff', border: '1px solid white' },
  },
  {
    id: 'design',
    type: 'group',
    data: { title: "UX/UI Design", subline: "Bookshelf Area" },
    position: { x: 1040, y: 400 },
    className: 'light',
    style: { backgroundColor: 'rgba(0, 115, 198, 0.2)', width: 210, height: 250, color: '#ffffff', border: '1px solid white' },
  },
  {
    id: 'cad',
    type: 'group',
    data: { title: "3D Modeling (CAD)", subline: "Bookshelf Area" },
    position: { x: 1290, y: 400 },
    className: 'light',
    style: { backgroundColor: 'rgba(0, 115, 198, 0.2)', width: 320, height: 610, color: '#ffffff', border: '1px solid white' },
  },
  {
    id: 'daw',
    type: 'group',
    data: { title: "Music Edition (DAW)", subline: "Bookshelf Area" },
    position: { x: 1650, y: 400 },
    className: 'light',
    style: { backgroundColor: 'rgba(0, 115, 198, 0.2)', width: 280, height: 610, color: '#ffffff', border: '1px solid white' },
  },
  {
    id: 'dev',
    type: 'group',
    data: { title: "Front-End Development", subline: "Bookshelf Area" },
    position: { x: 1970, y: 400 },
    className: 'light',
    style: { backgroundColor: 'rgba(0, 115, 198, 0.2)', width: 260, height: 520, color: '#ffffff', border: '1px solid white' },
  },
  {
    id: 'render',
    type: 'group',
    data: { title: "Real-Time Rendering", subline: "Bookshelf Area" },
    position: { x: 2270, y: 400 },
    className: 'light',
    style: { backgroundColor: 'rgba(0, 115, 198, 0.2)', width: 210, height: 250, color: '#ffffff', border: '1px solid white' },
  },
  {
    id: 'xd',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Adobe XD", subline: "Book" },
    position: { x: 20, y: 70 },
    parentNode: 'adobe',
    extent: 'parent'
  },
  {
    id: 'premiere',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Adobe Premiere Pro", subline: "Book" },
    position: { x: 20, y: 160 },
    parentNode: 'adobe',
    extent: 'parent'
  },
  {
    id: 'illustrator',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Adobe Illustrator", subline: "Book" },
    position: { x: 20, y: 250 },
    parentNode: 'adobe',
    extent: 'parent'
  },
  {
    id: 'indesign',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Adobe InDesign", subline: "Book" },
    position: { x: 20, y: 340 },
    parentNode: 'adobe',
    extent: 'parent'
  },
  {
    id: 'photoshop',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Adobe Photoshop", subline: "Book" },
    position: { x: 20, y: 430 },
    parentNode: 'adobe',
    extent: 'parent'
  },
  {
    id: 'aftereffect',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Adobe After Effects", subline: "Book" },
    position: { x: 20, y: 520 },
    parentNode: 'adobe',
    extent: 'parent'
  },
  {
    id: 'sketchapp',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Sketch App", subline: "Book" },
    position: { x: 20, y: 70 },
    parentNode: 'design',
    extent: 'parent'
  },
  {
    id: 'figma',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Figma", subline: "Book" },
    position: { x: 20, y: 160 },
    parentNode: 'design',
    extent: 'parent'
  },
  {
    id: 'archicad',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Graphisoft Archicad", subline: "Book" },
    position: { x: 20, y: 70 },
    parentNode: 'cad',
    extent: 'parent'
  },
  {
    id: 'grasshopper',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Grasshopper (Rhino Plugin)", subline: "Book" },
    position: { x: 20, y: 160 },
    parentNode: 'cad',
    extent: 'parent'
  },
  {
    id: 'rhino',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Rhinoceros 3D", subline: "Book" },
    position: { x: 20, y: 250 },
    parentNode: 'cad',
    extent: 'parent'
  },
  {
    id: 'cinema4d',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Maxon Cinema 4D", subline: "Book" },
    position: { x: 20, y: 340 },
    parentNode: 'cad',
    extent: 'parent'
  },
  {
    id: 'blender',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Blender", subline: "Book" },
    position: { x: 20, y: 430 },
    parentNode: 'cad',
    extent: 'parent'
  },
  {
    id: 'houdini',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Side-FX Houdini", subline: "Book" },
    position: { x: 20, y: 520 },
    parentNode: 'cad',
    extent: 'parent'
  },
  {
    id: 'audition',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Adobe Audition", subline: "Book" },
    position: { x: 20, y: 70 },
    parentNode: 'daw',
    extent: 'parent'
  },
  {
    id: 'logic',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Logic Pro-X", subline: "Book" },
    position: { x: 20, y: 160 },
    parentNode: 'daw',
    extent: 'parent'
  },
  {
    id: 'protools',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Avid Pro-Tools", subline: "Book" },
    position: { x: 20, y: 250 },
    parentNode: 'daw',
    extent: 'parent'
  },
  {
    id: 'finale',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Finale Music Notation", subline: "Book" },
    position: { x: 20, y: 340 },
    parentNode: 'daw',
    extent: 'parent'
  },
  {
    id: 'notion',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Notion Music", subline: "Book" },
    position: { x: 20, y: 430 },
    parentNode: 'daw',
    extent: 'parent'
  },
  {
    id: 'flstudio',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "FL Studio", subline: "Book" },
    position: { x: 20, y: 520 },
    parentNode: 'daw',
    extent: 'parent'
  },
  {
    id: 'react',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "React Library", subline: "Book" },
    position: { x: 20, y: 70 },
    parentNode: 'dev',
    extent: 'parent'
  },
  {
    id: 'javascript',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Javascript", subline: "Book" },
    position: { x: 20, y: 160 },
    parentNode: 'dev',
    extent: 'parent'
  },
  {
    id: 'typescript',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Typescript", subline: "Book" },
    position: { x: 20, y: 250 },
    parentNode: 'dev',
    extent: 'parent'
  },
  {
    id: 'nextjs',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Next.js Framework", subline: "Book" },
    position: { x: 20, y: 340 },
    parentNode: 'dev',
    extent: 'parent'
  },
  {
    id: 'threejs',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Three.js Library", subline: "Book" },
    position: { x: 20, y: 430 },
    parentNode: 'dev',
    extent: 'parent'
  },
  {
    id: 'unity',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Unity", subline: "Book" },
    position: { x: 20, y: 70 },
    parentNode: 'render',
    extent: 'parent'
  },
  {
    id: 'twinmotion',
    type: 'turbo',
    data: { icon: <Image id='example' className='ObjectIcon' src={ObjectIcon} width={20} height={20} alt='example image' />, title: "Twinmotion", subline: "Book" },
    position: { x: 20, y: 160 },
    parentNode: 'render',
    extent: 'parent'
  },
];

const initialEdges = [
  { id: 'main-studio', type: 'smoothstep', source: 'main', target: 'studio'},
  { id: 'main-awards', type: 'smoothstep', source: 'main', target: 'awards' },
  { id: 'main-lobby', type: 'smoothstep', source: 'main', target: 'lobby' },
  { id: 'main-library', type: 'smoothstep', source: 'main', target: 'library' },
  { id: 'main-stairs', type: 'smoothstep', source: 'main', target: 'stairs' },
  { id: 'main-rooftop', type: 'smoothstep', source: 'main', target: 'rooftop' },
  { id: 'library-adobe', type: 'smoothstep', source: 'library', target: 'adobe' },
  { id: 'library-design', type: 'smoothstep', source: 'library', target: 'design' },
  { id: 'library-cad', type: 'smoothstep', source: 'library', target: 'cad' },
  { id: 'library-daw', type: 'smoothstep', source: 'library', target: 'daw' },
  { id: 'library-dev', type: 'smoothstep', source: 'library', target: 'dev' },
  { id: 'library-render', type: 'smoothstep', source: 'library', target: 'render' },
];

export const SpaceMap: React.FC<Props> = ({ onMouseOver, isOpened }) => {

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => setEdges((els) => addEdge(params, els)), []);

  const divStyle = {
    height: isOpened ? 'calc(100% - 56px)' : '0%',
  };

  return (

    <div className='SpaceMapWindow' style={divStyle} onMouseOver={onMouseOver} >

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Controls showInteractive={false} />
        <svg>
          <defs>
            <linearGradient id="edge-gradient">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#2a8af6" />
            </linearGradient>

            <marker
              id="edge-circle"
              viewBox="-5 -5 10 10"
              refX="0"
              refY="0"
              markerUnits="strokeWidth"
              markerWidth="10"
              markerHeight="10"
              orient="auto"
            >
              <circle stroke="#2a8af6" strokeOpacity="0.75" r="2" cx="0" cy="0" />
            </marker>
          </defs>
        </svg>
      </ReactFlow>
    </div>

  );
}

export default SpaceMap