import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useEffect, useRef, useState } from "react";
import { format, isDate } from "date-fns";

export default function FormDate({
  value,
  onChange,
}: {
  value: any;
  onChange: any;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const dropdownRef = useRef<any>();
  const year = new Date().getFullYear();
  const [month, setMonth] = useState<Date>();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsEdit(false);
      }
    };
    setMonth(value);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      <div className="relative">
        <div
          className="border p-2 rounded-md cursor-pointer text-sm"
          onClick={() => setIsEdit(!isEdit)}
        >
          {value && isDate(value) && format(value, "yyyy-MM-dd")}
          {!value && <p className="text-muted">1990-01-01</p>}
        </div>
        {isEdit && (
          <div className="absolute z-10 bg-white border ">
            <DayPicker
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={value}
              onSelect={(e) => onChange(e)}
              showOutsideDays
              fixedWeeks
              captionLayout="dropdown-buttons"
              fromYear={1900}
              toYear={year}
            />
          </div>
        )}
      </div>
    </div>
  );
}
