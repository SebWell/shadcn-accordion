<template>
  <div class="ww-accordion">
    <div 
      v-for="(item, index) in content.items"
      :key="`accordion-item-${index}`"
      class="accordion-item"
    >
      <!-- Accordion Header/Trigger -->
      <div class="accordion-header">
        <button
          class="accordion-trigger"
          :aria-expanded="openItems.includes(index)"
          :aria-controls="`content-${index}`"
          :id="`trigger-${index}`"
          @click="toggleItem(index)"
          @keydown="handleKeyDown($event, index)"
        >
          <span class="accordion-title">{{ item.title || 'Accordion Item' }}</span>
          <svg 
            :class="['accordion-chevron', { 'accordion-chevron-open': openItems.includes(index) }]"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>

      <!-- Accordion Content -->
      <div
        v-show="openItems.includes(index)"
        class="accordion-content"
        :id="`content-${index}`"
        :aria-labelledby="`trigger-${index}`"
        role="region"
      >
        <div class="accordion-body">
          <div v-html="item.content || 'Content for accordion item'"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShadcnAccordion',
  props: {
    content: { type: Object, required: true },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  data() {
    return {
      openItems: [...(this.content.defaultOpenItems || [])]
    }
  },
  methods: {
    toggleItem(index) {
      const isOpen = this.openItems.includes(index)
      
      if (this.content.type === 'single') {
        if (isOpen && this.content.collapsible) {
          this.openItems = []
        } else if (!isOpen) {
          this.openItems = [index]
        }
      } else {
        if (isOpen) {
          this.openItems = this.openItems.filter(i => i !== index)
        } else {
          this.openItems = [...this.openItems, index]
        }
      }

      this.$emit('trigger-event', {
        name: 'change',
        event: {
          openItems: [...this.openItems],
          toggledItem: index,
          item: this.content.items[index],
          isOpen: !isOpen
        }
      })
    },

    handleKeyDown(event, index) {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          this.toggleItem(index)
          break
        case 'ArrowDown':
          event.preventDefault()
          this.focusNextItem(index)
          break
        case 'ArrowUp':
          event.preventDefault()
          this.focusPreviousItem(index)
          break
        case 'Home':
          event.preventDefault()
          this.focusFirstItem()
          break
        case 'End':
          event.preventDefault()
          this.focusLastItem()
          break
      }
    },

    focusNextItem(currentIndex) {
      const nextIndex = (currentIndex + 1) % this.content.items.length
      document.getElementById(`trigger-${nextIndex}`)?.focus()
    },

    focusPreviousItem(currentIndex) {
      const prevIndex = currentIndex === 0 ? this.content.items.length - 1 : currentIndex - 1
      document.getElementById(`trigger-${prevIndex}`)?.focus()
    },

    focusFirstItem() {
      document.getElementById('trigger-0')?.focus()
    },

    focusLastItem() {
      const lastIndex = this.content.items.length - 1
      document.getElementById(`trigger-${lastIndex}`)?.focus()
    }
  }
}
</script>

<style>
/* ===== SHADCN UI CSS VARIABLES ===== */

/* Shadcn UI Variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}

/* ===== ACCORDION STYLES - EXACTEMENT COMME SHADCN UI ===== */

.ww-accordion {
  width: 100%;
  font-family: inherit;
  color: hsl(var(--foreground));
}

.ww-accordion .accordion-item {
  border-bottom: 1px solid hsl(var(--border));
}

.ww-accordion .accordion-item:first-child {
  border-top: 1px solid hsl(var(--border));
}

.ww-accordion .accordion-header {
  display: flex;
}

.ww-accordion .accordion-trigger {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  font-weight: 500;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  color: hsl(var(--foreground));
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
}

.ww-accordion .accordion-trigger:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.ww-accordion .accordion-trigger:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring));
  border-radius: calc(var(--radius) - 2px);
}

.ww-accordion .accordion-trigger:disabled {
  pointer-events: none;
  opacity: 0.5;
}

.ww-accordion .accordion-title {
  flex: 1;
  text-align: left;
  font-weight: inherit;
}

.ww-accordion .accordion-chevron {
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
  color: hsl(var(--muted-foreground));
}

.ww-accordion .accordion-chevron-open {
  transform: rotate(180deg);
}

.ww-accordion .accordion-content {
  overflow: hidden;
  font-size: 0.875rem;
  line-height: 1.5;
  color: hsl(var(--foreground));
}

.ww-accordion .accordion-body {
  padding-bottom: 1rem;
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
}

/* Animations pour le contenu */
.ww-accordion .accordion-content {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 