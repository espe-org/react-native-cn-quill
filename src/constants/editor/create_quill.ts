export const create_quill = ({
  id,
  table,
  toolbar,
  clipboard,
  keyboard,
  placeholder,
  theme,
  customFonts = [],
  customJS,
}: {
  id: string;
  table: boolean;
  toolbar: 'false' | string;
  clipboard: string;
  keyboard: string;
  placeholder: string;
  theme: 'snow' | 'bubble';
  customFonts: Array<string>;
  customJS: string;
}) => {
  let font = '';
  if (customFonts.length > 0) {
    const fontList = "'" + customFonts.join("','") + "'";
    font = `
    // Add fonts to whitelist
    var Font = Quill.import('formats/font');
    Font.whitelist = [${fontList}];
    Quill.register(Font, true);

    `;
  }

  let modules = `table: ${table}, toolbar: ${toolbar},`;

  if (clipboard) {
    modules += `clipboard: ${clipboard},`;
  }
  if (keyboard) {
    modules += `keyboard: ${keyboard},`;
  }

  return `
  <script>
  
  ${font}
  ${customJS}
  var quill = new Quill('#${id}', {
    modules: { ${modules} },
    placeholder: '${placeholder}',
    theme: '${theme}'
  });

  quill.clipboard.addMatcher(Node.ELEMENT_NODE, function (node, delta) {
    delta.ops = delta.ops.map(op => {
      if (typeof op.insert === 'string') {
        return { insert: op.insert };
      }
      return { insert: '' };
    });
    return delta;
  });

  quill.root.setAttribute('spellcheck', false);
  </script>
  `;
};
