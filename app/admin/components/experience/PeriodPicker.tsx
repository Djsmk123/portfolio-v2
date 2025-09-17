"use client"

import React from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from 'lucide-react'

type Props = {
  months: string[]
  years: number[]
  startMonth: string
  startYear: string
  endMonth: string
  endYear: string
  isPresent: boolean
  errors: Record<string, string>
  setStartMonth: (v: string) => void
  setStartYear: (v: string) => void
  setEndMonth: (v: string) => void
  setEndYear: (v: string) => void
  setIsPresent: (v: boolean) => void
}

function PeriodPicker (props: Props) {
  const { months, years, startMonth, startYear, endMonth, endYear, isPresent, errors, setStartMonth, setStartYear, setEndMonth, setEndYear, setIsPresent } = props

  return (
    <div className="pt-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Employment Period <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center gap-2">
          <Checkbox
            id="present"
            checked={isPresent}
            onCheckedChange={checked => setIsPresent(Boolean(checked))}
          />
          <Label htmlFor="present" className="text-sm font-normal cursor-pointer select-none">
            Currently working here
          </Label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Start Date</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select value={startMonth} onValueChange={setStartMonth}>
              <SelectTrigger className={errors.startDate ? 'border-red-500' : ''}>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, idx) => (
                  <SelectItem key={idx} value={String(idx + 1)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={startYear} onValueChange={setStartYear}>
              <SelectTrigger className={errors.startDate ? 'border-red-500' : ''}>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-600">{isPresent ? 'End Date (Current)' : 'End Date'}</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select value={endMonth} onValueChange={setEndMonth} disabled={isPresent}>
              <SelectTrigger className={errors.endDate ? 'border-red-500' : ''} disabled={isPresent}>
                <SelectValue placeholder={isPresent ? 'Present' : 'Month'} />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, idx) => (
                  <SelectItem key={idx} value={String(idx + 1)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={endYear} onValueChange={setEndYear} disabled={isPresent}>
              <SelectTrigger className={errors.endDate ? 'border-red-500' : ''} disabled={isPresent}>
                <SelectValue placeholder={isPresent ? 'Present' : 'Year'} />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
        </div>
      </div>
    </div>
  )
}

export default React.memo(PeriodPicker)


