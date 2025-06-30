export default {
  editor: {
    label: {
      en: "shadcn Accordion",
      fr: "Accordéon shadcn"
    },
    icon: 'fas fa-list-ul',
    bubble: {
      icon: 'fas fa-list-ul'
    },
    deprecated: false
  },
  properties: {
    type: {
      label: {
        en: "Type",
        fr: "Type"
      },
      type: "TextSelect",
      options: {
        options: [
          { value: "single", label: { en: "Single (one at a time)", fr: "Unique (un à la fois)" } },
          { value: "multiple", label: { en: "Multiple (many at once)", fr: "Multiple (plusieurs à la fois)" } }
        ]
      },
      defaultValue: "single",
      section: "behavior"
    },
    collapsible: {
      label: {
        en: "Collapsible",
        fr: "Réductible"
      },
      type: "OnOff",
      defaultValue: true,
      hidden: content => content.type !== 'single',
      section: "behavior"
    },
    defaultOpenItems: {
      label: {
        en: "Default open items (indexes)",
        fr: "Éléments ouverts par défaut (index)"
      },
      type: "Text",
      defaultValue: "",
      bindable: true,
      section: "behavior"
    },
    items: {
      label: {
        en: "Accordion items",
        fr: "Éléments d'accordéon"
      },
      type: "Info",
      options: {
        text: { 
          en: "Configure accordion items in the repeater below",
          fr: "Configurez les éléments d'accordéon dans le répéteur ci-dessous"
        }
      },
      section: "content"
    },
    changeWorkflowId: {
      label: {
        en: "Change workflow",
        fr: "Workflow de changement"
      },
      type: "WorkflowId",
      bindable: true,
      section: "behavior"
    },
    customClasses: {
      label: {
        en: "Custom CSS classes",
        fr: "Classes CSS personnalisées"
      },
      type: "Text",
      bindable: true,
      section: "style"
    }
  },
  events: {
    change: {
      label: {
        en: "On accordion change",
        fr: "Lors du changement d'accordéon"
      },
      default: null
    }
  },
  sections: {
    content: {
      label: { en: "Content", fr: "Contenu" },
      expand: true
    },
    behavior: {
      label: { en: "Behavior", fr: "Comportement" },
      expand: true
    },
    style: {
      label: { en: "Style", fr: "Style" },
      expand: false
    }
  }
}; 