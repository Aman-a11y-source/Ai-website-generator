import { SwatchBook } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from '@/components/ui/button';

type Props = {
  selectedEl: HTMLElement | null,
  clearSelection: () => void;
}

function ElementSettingSection({ selectedEl, clearSelection }: Props) {
  const [classes, setClasses] = useState<string[]>([]);
  const [newClass, setNewClass] = useState("");
  const [align, setAlign] = React.useState<string[]>(
    selectedEl?.style.textAlign ? [selectedEl.style.textAlign] : []
  );

  const [borderRadius, setBorderRadius] = useState("");
  const [padding, setPadding] = useState("");
  const [margin, setMargin] = useState("");

  useEffect(() => {
    if (selectedEl) {
      setBorderRadius(selectedEl.style.borderRadius || "");
      setPadding(selectedEl.style.padding || "");
      setMargin(selectedEl.style.margin || "");
    } else {
      setBorderRadius("");
      setPadding("");
      setMargin("");
    }
  }, [selectedEl]);

  const [updateTrigger, setUpdateTrigger] = useState(0);

  const applyStyle = (property: string, value: string | null) => {
    if (selectedEl && value !== null) {
      selectedEl.style[property as any] = value;
      setUpdateTrigger(prev => prev + 1);
    }
  };

  React.useEffect(() => {
    if (selectedEl && align !== undefined) {
      if (align.length > 0) {
        selectedEl.style.textAlign = align[0];
      } else {
        selectedEl.style.textAlign = '';
      }
    }
  }, [align, selectedEl]);

  useEffect(() => {
    if (!selectedEl) return;

    const currentClassAttr = selectedEl.getAttribute("class") || "";
    const currentClasses = currentClassAttr
      .split(" ")
      .filter((c) => c.trim() !== "");
    setClasses(currentClasses);

    const observer = new MutationObserver(() => {
      const updatedAttr = selectedEl.getAttribute("class") || "";
      const updated = updatedAttr
        .split(" ")
        .filter((c) => c.trim() !== "");
      setClasses(updated);
    });

    observer.observe(selectedEl, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [selectedEl]);

  const removeClass = (cls: string) => {
    if (!selectedEl) return;
    const updated = classes.filter((c) => c !== cls);
    setClasses(updated);
    selectedEl.setAttribute("class", updated.join(" "));
  };

  const addClass = () => {
    if (!selectedEl) return;
    const trimmed = newClass.trim();
    if (!trimmed) return;
    if (!classes.includes(trimmed)) {
      const updated = [...classes, trimmed];
      setClasses(updated);
      selectedEl.setAttribute("class", updated.join(" "));
    }
    setNewClass("");
  };

  return (
    <div className='p-4 space-y-4 h-full'>
      <h2 className='flex gap-2 items-center font-bold'>
        <SwatchBook /> Settings
      </h2>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className='text-sm'>Font Size</label>
          <Select value={selectedEl?.style?.fontSize || '24px'}
            onValueChange={(value) => applyStyle('fontSize', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(53)].map((_, index) => (
                <SelectItem value={index + 12 + 'px'} key={index}>
                  {index + 12}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-sm block'>Text Color</label>
          <input type='color'
            className='w-[40px] h-[40px] rounded-lg mt-1'
            value={selectedEl?.style.color || '#000000'}
            onChange={(event) => applyStyle('color', event.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-sm mb-1 block">Text Alignment</label>
        <ToggleGroup
          value={align}
          onValueChange={setAlign}
          className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-1 inline-flex w-full justify-between text-foreground"
        >
          <ToggleGroupItem value="left" className="p-2 rounded hover:bg-stone-200 dark:hover:bg-stone-800 data-[state=on]:bg-stone-200 dark:data-[state=on]:bg-stone-800 flex-1 flex justify-center">
            <AlignLeft size={20} />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" className="p-2 rounded hover:bg-stone-200 dark:hover:bg-stone-800 data-[state=on]:bg-stone-200 dark:data-[state=on]:bg-stone-800 flex-1 flex justify-center">
            <AlignCenter size={20} />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" className="p-2 rounded hover:bg-stone-200 dark:hover:bg-stone-800 data-[state=on]:bg-stone-200 dark:data-[state=on]:bg-stone-800 flex-1 flex justify-center">
            <AlignRight size={20} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <label className='text-sm block'>Background</label>
          <input type='color'
            className='w-[40px] h-[40px] rounded-lg mt-1'
            value={selectedEl?.style?.backgroundColor || '#ffffff'}
            onChange={(event) => applyStyle('backgroundColor', event.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className='text-sm'>Border Radius</label>
          <Input type='text'
            placeholder='e.g. 8px'
            value={borderRadius}
            onChange={(e) => {
              setBorderRadius(e.target.value);
              applyStyle('borderRadius', e.target.value);
            }}
            className='mt-1'
          />
        </div>
      </div>

      <div>
        <label className='text-sm'>Padding</label>
        <Input type='text'
          placeholder='e.g. 10px 15px'
          value={padding}
          onChange={(e) => {
            setPadding(e.target.value);
            applyStyle('padding', e.target.value);
          }}
          className='mt-1'
        />
      </div>

      <div>
        <label className='text-sm'>Margin</label>
        <Input type='text'
          placeholder='e.g. 10px 15px'
          value={margin}
          onChange={(e) => {
            setMargin(e.target.value);
            applyStyle('margin', e.target.value);
          }}
          className='mt-1'
        />
      </div>

      <div>
        <label className="text-sm font-medium">Classes</label>

        <div className="flex flex-wrap gap-2 mt-2">
          {classes.length > 0 ? (
            classes.map((cls) => (
              <span
                key={cls}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
              >
                {cls}
                <button
                  onClick={() => removeClass(cls)}
                  className="ml-1 text-red-500 hover:text-red-700 cursor-pointer font-bold"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No classes applied</span>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <Input
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            placeholder="Add class..."
          />
          <Button type="button" onClick={addClass}>
            Add
          </Button>
        </div>
      </div>

    </div>
  )
}

export default ElementSettingSection;