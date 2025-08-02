<template>
  <div :class="accordionClasses">
    <div 
      v-for="(item, index) in content.items"
      :key="`accordion-item-${index}`"
      :class="accordionItemClasses"
    >
      <!-- Accordion Header/Trigger -->
      <div class="accordion-header">
        <button
          :class="accordionTriggerClasses"
          :aria-expanded="openItems.includes(index)"
          :aria-controls="`content-${index}`"
          :id="`trigger-${index}`"
          @click="toggleItem(index)"
          @keydown="handleKeyDown($event, index)"
        >
          <span class="accordion-title">{{ item.title }}</span>
          <svg 
            :class="getChevronClasses(index)"
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
        :class="accordionContentClasses"
        :id="`content-${index}`"
        :aria-labelledby="`trigger-${index}`"
        role="region"
      >
        <div class="accordion-body">
          <div v-if="item.content" v-html="item.content" />
          <slot v-else :name="`item-${index}`" :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'ShadcnAccordion',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        type: 'single',
        collapsible: true,
        defaultOpenItems: [],
        items: [
          { title: 'Section 1', content: 'Content for section 1' },
          { title: 'Section 2', content: 'Content for section 2' },
          { title: 'Section 3', content: 'Content for section 3' }
        ]
      })
    },
    wwEditorState: { type: Object, required: true }
  },
  emits: ['trigger-event', 'change', 'item-click'],
  setup(props, { emit }) {
    const openItems = ref([...props.content.defaultOpenItems])

    const accordionClasses = computed(() => {
      return 'accordion-container'
    })

    const accordionItemClasses = computed(() => {
      return 'accordion-item'
    })

    const accordionTriggerClasses = computed(() => {
      return 'accordion-trigger'
    })

    const accordionContentClasses = computed(() => {
      return 'accordion-content'
    })

    const getChevronClasses = (index) => {
      return `accordion-chevron ${openItems.value.includes(index) ? 'accordion-chevron-open' : ''}`
    }

    const toggleItem = (index) => {
      const isOpen = openItems.value.includes(index)
      
      if (props.content.type === 'single') {
        // Single mode: only one item can be open
        if (isOpen && props.content.collapsible) {
          openItems.value = []
        } else if (!isOpen) {
          openItems.value = [index]
        }
      } else {
        // Multiple mode: multiple items can be open
        if (isOpen) {
          openItems.value = openItems.value.filter(i => i !== index)
        } else {
          openItems.value = [...openItems.value, index]
        }
      }

      emit('change', { 
        openItems: [...openItems.value], 
        toggledItem: index, 
        isOpen: !isOpen 
      })
      
      emit('item-click', {
        item: props.content.items[index],
        index,
        isOpen: !isOpen
      })

      // Trigger WeWeb event
      emit('trigger-event', {
        domEvent: null,
        value: {
          openItems: [...openItems.value],
          toggledItem: index,
          item: props.content.items[index]
        }
      })
    }

    const handleKeyDown = (event, index) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          toggleItem(index)
          break
        case 'ArrowDown':
          event.preventDefault()
          focusNextItem(index)
          break
        case 'ArrowUp':
          event.preventDefault()
          focusPreviousItem(index)
          break
        case 'Home':
          event.preventDefault()
          focusFirstItem()
          break
        case 'End':
          event.preventDefault()
          focusLastItem()
          break
      }
    }

    const focusNextItem = (currentIndex) => {
      const nextIndex = (currentIndex + 1) % props.content.items.length
      document.getElementById(`trigger-${nextIndex}`)?.focus()
    }

    const focusPreviousItem = (currentIndex) => {
      const prevIndex = currentIndex === 0 ? props.content.items.length - 1 : currentIndex - 1
      document.getElementById(`trigger-${prevIndex}`)?.focus()
    }

    const focusFirstItem = () => {
      document.getElementById('trigger-0')?.focus()
    }

    const focusLastItem = () => {
      const lastIndex = props.content.items.length - 1
      document.getElementById(`trigger-${lastIndex}`)?.focus()
    }

    return {
      openItems,
      accordionClasses,
      accordionItemClasses,
      accordionTriggerClasses,
      accordionContentClasses,
      getChevronClasses,
      toggleItem,
      handleKeyDown
    }
  }
}
</script>

<style scoped>
/* Variables CSS Shadcn/UI */
:root {
  --border: hsl(214.3, 31.8%, 91.4%);
  --foreground: hsl(222.2, 84%, 4.9%);
  --muted-foreground: hsl(215.4, 16.3%, 46.9%);
  --background: hsl(0, 0%, 100%);
  --ring: hsl(222.2, 84%, 4.9%);
}

/* Accordion Styles */
.accordion-container {
  width: 100%;
}

.accordion-item {
  border-bottom: 1px solid var(--border);
}

.accordion-header {
  display: flex;
}

.accordion-trigger {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  font-weight: 500;
  transition: all 0.2s;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--foreground);
}

.accordion-trigger:hover {
  text-decoration: underline;
}

.accordion-trigger:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--ring);
  border-radius: 4px;
}

.accordion-title {
  flex: 1;
  text-align: left;
}

.accordion-chevron {
  height: 16px;
  width: 16px;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.accordion-chevron-open {
  transform: rotate(180deg);
}

.accordion-content {
  overflow: hidden;
  font-size: 14px;
  transition: all 0.2s;
}

.accordion-body {
  padding-bottom: 16px;
  padding-top: 0;
}
</style> 