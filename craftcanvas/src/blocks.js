// Each block has:
// id      → unique identifier used by GrapesJS BlockManager
// label   → display name shown under the icon
// icon    → emoji shown in the grid
// content → HTML string that gets added to the canvas

const BLOCKS = [
  {
    id: 'text',
    label: 'Text',
    icon: '📝',
    content: `
      <p style="
        padding: 8px;
        font-size: 16px;
        line-height: 1.6;
        color: #333;
      ">Edit this text</p>
    `,
  },
  {
    id: 'heading',
    label: 'Heading',
    icon: '🔤',
    content: `
      <h2 style="
        padding: 8px;
        font-size: 2rem;
        font-weight: 800;
        color: #111;
      ">Your Heading</h2>
    `,
  },
  {
    id: 'button',
    label: 'Button',
    icon: '🔲',
    content: `
      <a href="#" style="
        display: inline-block;
        padding: 12px 28px;
        background: #5b6cff;
        color: #fff;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 700;
        font-size: 15px;
      ">Click Me</a>
    `,
  },
  {
    id: 'image',
    label: 'Image',
    icon: '🖼️',
    content: `
      <img
        src="https://placehold.co/600x300"
        style="max-width:100%;display:block;border-radius:8px;"
      />
    `,
  },
  {
    id: 'divider',
    label: 'Divider',
    icon: '➖',
    content: `
      <hr style="
        border: none;
        border-top: 2px solid #e0e0e0;
        margin: 20px 0;
      "/>
    `,
  },
  {
    id: 'section',
    label: 'Section',
    icon: '▬',
    content: `
      <section style="
        padding: 60px 40px;
        background: #f8f9fa;
        min-height: 120px;
      "></section>
    `,
  },
  {
    id: 'two-columns',
    label: '2 Columns',
    icon: '⬛⬛',
    content: `
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        padding: 8px;
      ">
        <div style="background:#f0f0f0;padding:24px;border-radius:8px">
          Column 1
        </div>
        <div style="background:#f0f0f0;padding:24px;border-radius:8px">
          Column 2
        </div>
      </div>
    `,
  },
  {
    id: 'three-columns',
    label: '3 Columns',
    icon: '⬛⬛⬛',
    content: `
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        padding: 8px;
      ">
        <div style="background:#f0f0f0;padding:20px;border-radius:8px">Col 1</div>
        <div style="background:#f0f0f0;padding:20px;border-radius:8px">Col 2</div>
        <div style="background:#f0f0f0;padding:20px;border-radius:8px">Col 3</div>
      </div>
    `,
  },
  {
    id: 'hero',
    label: 'Hero',
    icon: '🌟',
    content: `
      <section style="
        padding: 80px 40px;
        background: linear-gradient(135deg, #5b6cff, #ff5b8d);
        color: #fff;
        text-align: center;
      ">
        <h1 style="font-size:2.5rem;font-weight:800;margin-bottom:16px">
          Hero Title
        </h1>
        <p style="font-size:1rem;opacity:0.85;margin-bottom:28px">
          Your subtitle goes here
        </p>
        <a href="#" style="
          display:inline-block;
          padding:12px 28px;
          background:#fff;
          color:#5b6cff;
          border-radius:8px;
          font-weight:700;
          text-decoration:none;
        ">Get Started</a>
      </section>
    `,
  },
  {
    id: 'card',
    label: 'Card',
    icon: '🃏',
    content: `
      <div style="
        padding: 24px;
        background: #fff;
        border-radius: 12px;
        border: 1px solid #e0e0e0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        max-width: 320px;
      ">
        <div style="font-size:2rem;margin-bottom:12px">✦</div>
        <h3 style="font-weight:700;margin-bottom:8px;font-size:1.1rem">
          Card Title
        </h3>
        <p style="color:#666;font-size:14px;line-height:1.6">
          Card description goes here. Add your content.
        </p>
      </div>
    `,
  },
]

export default BLOCKS