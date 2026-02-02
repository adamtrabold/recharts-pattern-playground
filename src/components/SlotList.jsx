import React from 'react';
import { usePalette } from '../context/PaletteContext';
import { swatchBackgroundCSS, getSlotDescription } from '../utils/patternGenerator';
import { MAX_SLOTS, MIN_SLOTS } from '../utils/storage';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableSlot({ slot, index, isSelected, version, onSelect, onRemove, canRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slot.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : undefined,
  };

  const handleClick = (e) => {
    // Don't select if clicking remove button
    if (e.target.closest('.slot-remove-btn')) return;
    onSelect(index);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(index);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`slot-option-${index}`}
      role="option"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      className={`slot-option ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={handleClick}
      {...attributes}
    >
      <div className="slot-drag-handle" {...listeners}>
        <span className="drag-handle-icon">
          <span /><span /><span />
        </span>
      </div>
      {canRemove && (
        <button
          type="button"
          className="slot-remove-btn"
          onClick={handleRemove}
          aria-label={`Remove ${slot.label}`}
        >
          ×
        </button>
      )}
      <div 
        className="slot-swatch"
        style={swatchBackgroundCSS(slot)}
      />
      <div className="slot-description">
        <span className="slot-type">{getSlotDescription(slot).type}</span>
        {getSlotDescription(slot).details && (
          <span className="slot-details">{getSlotDescription(slot).details}</span>
        )}
      </div>
      {version === 'b' && <span className="slot-version-badge">B</span>}
    </div>
  );
}

export function SlotList() {
  const { state, updateUI, getActiveSlot, addSlot, removeSlot, reorderSlots } = usePalette();
  const { selectedSlot } = state.ui;
  const slotCount = state.palette.length;
  const canAddSlot = slotCount < MAX_SLOTS;
  const canRemoveSlot = slotCount > MIN_SLOTS;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = state.palette.findIndex((s) => s.id === active.id);
      const newIndex = state.palette.findIndex((s) => s.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderSlots(oldIndex, newIndex);
      }
    }
  };

  const handleSlotClick = (index) => {
    updateUI({ selectedSlot: index });
  };

  const handleKeyDown = (e) => {
    const maxIndex = slotCount - 1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(maxIndex, selectedSlot + 1);
      updateUI({ selectedSlot: next });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(0, selectedSlot - 1);
      updateUI({ selectedSlot: prev });
    } else if (e.key === 'Home') {
      e.preventDefault();
      updateUI({ selectedSlot: 0 });
    } else if (e.key === 'End') {
      e.preventDefault();
      updateUI({ selectedSlot: maxIndex });
    }
  };

  const handleAddSlot = () => {
    addSlot();
  };

  const handleRemoveSlot = (index) => {
    removeSlot(index);
  };

  // Get slot IDs for SortableContext
  const slotIds = state.palette.map((slot) => slot.id);

  return (
    <div className="slot-list-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={slotIds} strategy={rectSortingStrategy}>
          <div 
            className="slot-list" 
            role="listbox" 
            aria-label="Palette slots"
            aria-activedescendant={`slot-option-${selectedSlot}`}
            onKeyDown={handleKeyDown}
          >
            {state.palette.map((slot, index) => {
              const activeSlot = getActiveSlot(index);
              const isSelected = selectedSlot === index;
              const version = state.ui.activeVersions[index];
              
              return (
                <div key={slot.id} className="slot-wrapper">
                  <span className="slot-position">{index + 1}</span>
                  <SortableSlot
                    slot={activeSlot}
                    index={index}
                    isSelected={isSelected}
                    version={version}
                    onSelect={handleSlotClick}
                    onRemove={handleRemoveSlot}
                    canRemove={canRemoveSlot}
                  />
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
      
      {canAddSlot && (
        <button
          type="button"
          className="slot-add-btn"
          onClick={handleAddSlot}
          aria-label="Add new slot"
        >
          <span className="slot-add-icon">+</span>
          <span className="slot-add-text">Add Slot</span>
        </button>
      )}
    </div>
  );
}

export default SlotList;
