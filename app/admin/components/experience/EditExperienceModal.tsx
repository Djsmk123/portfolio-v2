"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {  Briefcase, Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { experienceType, ExperienceType } from "@/app/data/type"
import JobDetails from "./JobDetails"
import PeriodPicker from "./PeriodPicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type Props = {
exp: experienceType
  isNew: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (e: experienceType) => void
  onSave: () => void | Promise<void>
  isSaving: boolean
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

export default function EditExperienceModal ({
  exp,
  isNew,
  open,
  onOpenChange,
  onChange,
  onSave,
  isSaving,
}: Props) {
  const [startMonth, setStartMonth] = useState("")
  const [startYear, setStartYear] = useState("")
  const [endMonth, setEndMonth] = useState("")
  const [endYear, setEndYear] = useState("")
  const [isPresent, setIsPresent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // parse incoming value once
  useEffect(() => {
    const raw = (exp.date || "").trim()
    if (!raw) return
    const [startRaw, endRaw = ""] = (raw.includes(" - ") ? raw.split(" - ") : [raw, ""]).map(s => s.trim())
    if (/^\d{4}-\d{2}$/.test(startRaw)) {
      const [y, m] = startRaw.split("-")
      setStartYear(y)
      setStartMonth(String(parseInt(m)))
    }
    if (/present/i.test(endRaw)) {
      setIsPresent(true)
      setEndMonth("")
      setEndYear("")
    } else if (/^\d{4}-\d{2}$/.test(endRaw)) {
      const [y, m] = endRaw.split("-")
      setEndYear(y)
      setEndMonth(String(parseInt(m)))
      setIsPresent(false)
    }
  }, [exp.date])

  const formatDateString = useCallback(() => {
    if (!startMonth || !startYear) return ""
    const startStr = `${startYear}-${String(parseInt(startMonth)).padStart(2, '0')}`
    if (isPresent) return `${startStr} - Present`
    if (endMonth && endYear) {
      const endStr = `${endYear}-${String(parseInt(endMonth)).padStart(2, '0')}`
      return `${startStr} - ${endStr}`
    }
    return startStr
  }, [startMonth, startYear, endMonth, endYear, isPresent])

  // keep parent date in sync
  useEffect(() => {
    const dateStr = formatDateString()
    if (exp.date !== dateStr) onChange({ ...exp, date: dateStr })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formatDateString])

  const validateForm = useCallback(() => {
    const next: Record<string, string> = {}
    if (!exp.title.trim()) next.title = "Job title is required"
    if (!exp.company.trim()) next.company = "Company name is required"
    if (!exp.location.trim()) next.location = "Location is required"
    if (!exp.description.trim()) next.description = "Description is required"
    if (!exp.type) next.type = "Employment type is required"
    if (!startMonth || !startYear) next.startDate = "Start date is required"
    if (!isPresent && (!endMonth || !endYear)) next.endDate = "End date is required (or mark as Present)"
    if (startYear && startMonth && endYear && endMonth && !isPresent) {
      const a = new Date(parseInt(startYear), parseInt(startMonth) - 1)
      const b = new Date(parseInt(endYear), parseInt(endMonth) - 1)
      if (b < a) next.dateRange = "End date cannot be before start date"
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }, [exp, startMonth, startYear, endMonth, endYear, isPresent])

  const isValid = useMemo(() => (
    exp.title.trim() && exp.company.trim() && exp.location.trim() && exp.description.trim() && exp.type &&
    startMonth && startYear && (isPresent || (endMonth && endYear))
  ), [exp, startMonth, startYear, endMonth, endYear, isPresent])

  const handleSave = useCallback(async () => {
    if (!validateForm()) return
    await Promise.resolve()
    await onSave()
  }, [validateForm, onSave])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-sm sm:max-w-3xl h-[95vh] sm:h-auto sm:max-h-[90vh] p-0 flex flex-col">
        {/* Fixed Header */}
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b bg-muted/30 shrink-0">
          <DialogTitle className="text-lg sm:text-2xl font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="truncate">
              {isNew ? "Add New Experience" : "Edit Experience"}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Job Details Card */}
            <Card className="border-0 sm:border shadow-none sm:shadow-sm bg-muted/30">
              <CardContent className="p-4 sm:pt-6 space-y-4">
                <JobDetails exp={exp} errors={errors} onChange={onChange} setErrors={setErrors} />
              {/* Employment Type */}
              <div className="space-y-2">
                <Label htmlFor="employment-type" className="text-sm font-medium">Employment Type</Label>
                <Select
                  value={exp.type as unknown as string}
                  onValueChange={(v) => onChange({ ...exp, type: v as unknown as ExperienceType })}
                >
                  <SelectTrigger id="employment-type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ExperienceType.FullTime}>Full-time</SelectItem>
                    <SelectItem value={ExperienceType.Internship}>Internship</SelectItem>
                    <SelectItem value={ExperienceType.Contract}>Contract</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-xs text-destructive">{errors.type}</p>
                )}
              </div>
              </CardContent>
            </Card>

            {/* Period Picker Card */}
            <Card className="border-0 sm:border shadow-none sm:shadow-sm bg-muted/30">
              <CardContent className="p-4 sm:p-6">
                <PeriodPicker
                  months={months}
                  years={years}
                  startMonth={startMonth}
                  startYear={startYear}
                  endMonth={endMonth}
                  endYear={endYear}
                  isPresent={isPresent}
                  errors={errors}
                  setStartMonth={setStartMonth}
                  setStartYear={setStartYear}
                  setEndMonth={setEndMonth}
                  setEndYear={setEndYear}
                  setIsPresent={setIsPresent}
                />
                
                {/* Date Range Error */}
                {errors.dateRange && (
                  <Alert className="mt-4 border-destructive/20 bg-destructive/10">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive text-sm">
                      {errors.dateRange}
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Duration Preview */}
                {startMonth && startYear && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span className="break-words">Duration: {formatDateString()}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Toggle */}
            <div className="flex items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg gap-3">
              <div className="flex-1 min-w-0">
                <Label htmlFor="is-active" className="text-sm font-medium cursor-pointer">
                  Mark as Active
                </Label>
                <p className="text-xs text-muted-foreground mt-1 break-words">
                  Show this experience prominently on your profile
                </p>
              </div>
              <div className="shrink-0">
                <input
                  id="is-active"
                  type="checkbox"
                  className="h-4 w-4 accent-current cursor-pointer"
                  checked={exp.isActive !== false}
                  onChange={e => onChange({ ...exp, isActive: e.target.checked })}
                />
              </div>
            </div>
            
            {/* Mobile spacing at bottom */}
            <div className="sm:hidden h-4"></div>
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-muted/30 shrink-0">
          <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isSaving} 
              className="w-full sm:w-auto text-sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !isValid} 
              className="w-full sm:w-auto text-sm"
            >
              {isSaving ? 'Saving...' : (isNew ? 'Add Experience' : 'Save Changes')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}