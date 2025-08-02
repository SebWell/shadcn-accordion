export default {
  editor: {
    label: {
      en: "Shadcn UI Accordion",
      fr: "Accordéon Shadcn UI"
    },
    icon: "view-list",
    bubble: {
      icon: "accordion",
      tooltip: { 
        en: "Shadcn UI Accordion Component", 
        fr: "Composant Accordéon Shadcn UI" 
      }
    },
    customStylePropertiesOrder: [
      ["type", "collapsible"],
      ["defaultOpenItems"]
    ],
    customSettingsPropertiesOrder: [
      "items",
      "type", 
      "collapsible",
      "defaultOpenItems"
    ]
  },
  options: {
    autoByContent: false,
    sizable: true,
    hyperlink: false
  },
  triggerEvents: [
    {
      name: "trigger-event",
      label: { en: "On change", fr: "Au changement" },
      event: { value: "" },
      default: true
    }
  ],
  properties: {
    // ===== CONTENU =====
    items: {
      label: { en: "Accordion items", fr: "Éléments accordéon" },
      type: "Array",
      section: "content",
      options: {
        item: {
          type: "Object",
          options: {
            title: { type: "Text", label: { en: "Title", fr: "Titre" } },
            content: { type: "Text", label: { en: "Content", fr: "Contenu" } }
          }
        }
      },
      bindable: true,
      defaultValue: [
        { title: "Section 1", content: "Content for section 1" },
        { title: "Section 2", content: "Content for section 2" },
        { title: "Section 3", content: "Content for section 3" }
      ]
    },

    // ===== CONFIGURATION =====
    type: {
      label: { en: "Type", fr: "Type" },
      type: "TextSelect",
      section: "settings",
      options: {
        options: [
          { value: "single", label: { en: "Single (one at a time)", fr: "Simple (un à la fois)" } },
          { value: "multiple", label: { en: "Multiple (many open)", fr: "Multiple (plusieurs ouverts)" } }
        ]
      },
      defaultValue: "single",
      bindable: true
    },

    collapsible: {
      label: { en: "Collapsible", fr: "Repliable" },
      type: "OnOff",
      section: "settings",
      defaultValue: true,
      bindable: true,
      hidden: (content) => content.type !== "single"
    },

    defaultOpenItems: {
      label: { en: "Default open items", fr: "Éléments ouverts par défaut" },
      type: "Array",
      section: "settings",
      options: {
        item: { type: "Number" }
      },
      defaultValue: [],
      bindable: true
    }
  }
};
