<template>
  <div :class="accordionClasses">
    <div 
      v-for="(item, index) in content.items"
      :key="`accordion-item-${index}`"
      :class="accordionItemClasses"
    >
      <!-- Accordion Header/Trigger -->
      <div class="flex">
        <button
          :class="accordionTriggerClasses"
          :aria-expanded="openItems.includes(index)"
          :aria-controls="`content-${index}`"
          :id="`trigger-${index}`"
          @click="toggleItem(index)"
          @keydown="handleKeyDown($event, index)"
        >
          <span class="flex-1 text-left">{{ item.title }}</span>
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
        <div class="pb-4 pt-0">
          <div v-if="item.content" v-html="item.content" />
          <slot v-else :name="`item-${index}`" :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { cn } from './cn.js'

export default {
  name: 'WewebAccordion',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        type: 'single', // 'single' or 'multiple'
        collapsible: true,
        defaultOpenItems: [],
        items: [
          { title: 'Item 1', content: 'Content 1' },
          { title: 'Item 2', content: 'Content 2' }
        ],
        customClasses: ''
      })
    },
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const openItems = ref(
      props.modelValue.length > 0 ? [...props.modelValue] : [...props.content.defaultOpenItems]
    )

    const accordionClasses = computed(() => cn(
      "w-full",
      props.content.customClasses
    ))

    const accordionItemClasses = computed(() => cn(
      "border-b"
    ))

    const accordionTriggerClasses = computed(() => cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    ))

    const accordionContentClasses = computed(() => cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    ))

    const getChevronClasses = (index) => {
      return cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        {
          "rotate-180": openItems.value.includes(index)
        }
      )
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

      emit('update:modelValue', [...openItems.value])
      emit('change', { 
        openItems: [...openItems.value], 
        toggledItem: index, 
        isOpen: !isOpen 
      })

      // Execute Weweb workflow if defined
      if (props.content.changeWorkflowId && typeof wwLib !== 'undefined') {
        wwLib.executeWorkflow(props.content.changeWorkflowId)
      }
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

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 